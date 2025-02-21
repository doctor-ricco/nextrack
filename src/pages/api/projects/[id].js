import { prisma } from '@/lib/prisma'
import { isEndDateValid, formatDateError } from '@/utils/dateValidation'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const project = await prisma.project.findUnique({
        where: { id }
      })
      if (!project) {
        return res.status(404).json({ error: 'Projeto não encontrado' })
      }
      return res.status(200).json(project)
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar projeto' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { startDate, endDate, ...rest } = req.body

      // Validação de datas
      if (!isEndDateValid(startDate, endDate)) {
        return res.status(400).json({ 
          error: formatDateError(startDate, endDate)
        })
      }

      const project = await prisma.project.update({
        where: { id },
        data: {
          ...rest,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        }
      })
      return res.status(200).json(project)
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('eid')) {
        return res.status(400).json({ 
          error: 'Já existe um projeto com este EID. Por favor, use outro identificador.'
        })
      }
      return res.status(500).json({ 
        error: 'Não foi possível atualizar o projeto. Por favor, verifique os dados e tente novamente.'
      })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.project.delete({
        where: { id }
      })
      return res.status(204).end()
    } catch (error) {
      return res.status(500).json({ 
        error: 'Não foi possível excluir o projeto. Por favor, tente novamente.'
      })
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
} 