import { prisma } from '@/lib/prisma'
import { isEndDateValid, formatDateError, isValidDate, formatInvalidDateError } from '@/utils/dateValidation'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 5
      const search = req.query.search || ''
      const sortField = req.query.sortField || 'createdAt'
      const sortDirection = req.query.sortDirection || 'desc'
      const skip = (page - 1) * limit

      // Busca case-insensitive para SQLite
      const where = search ? {
        OR: [
          { name: { contains: search } },
          { eid: { contains: search } },
          { description: { contains: search } },
        ]
      } : {}

      // Buscar total com filtros
      const total = await prisma.project.count({ where })

      // Buscar projetos com filtros e paginação
      const projects = await prisma.project.findMany({
        where,
        orderBy: {
          [sortField]: sortDirection
        },
        skip,
        take: limit,
      })

      return res.status(200).json({
        projects,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
          perPage: limit,
          hasMore: skip + projects.length < total
        }
      })
    } catch (error) {
      console.error('Erro na busca:', error) // Para debug
      return res.status(500).json({ error: 'Erro ao buscar projetos' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { startDate, endDate, ...rest } = req.body

      // Validação de datas
      if (!isValidDate(startDate)) {
        return res.status(400).json({ 
          error: formatInvalidDateError('data de início')
        })
      }

      if (!isValidDate(endDate)) {
        return res.status(400).json({ 
          error: formatInvalidDateError('data de término')
        })
      }

      if (!isEndDateValid(startDate, endDate)) {
        return res.status(400).json({ 
          error: formatDateError(startDate, endDate)
        })
      }

      const project = await prisma.project.create({
        data: {
          ...rest,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        }
      })
      return res.status(201).json(project)
    } catch (error) {
      // Tratamento específico para erro de EID duplicado
      if (error.code === 'P2002' && error.meta?.target?.includes('eid')) {
        return res.status(400).json({ 
          error: 'Já existe um projeto com este EID. Por favor, use outro identificador.'
        })
      }
      return res.status(500).json({ 
        error: 'Não foi possível criar o projeto. Por favor, verifique os dados e tente novamente.'
      })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
} 