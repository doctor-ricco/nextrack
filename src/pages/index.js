import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import toast from 'react-hot-toast'
import ConfirmDialog from '@/components/ConfirmDialog'
import Spinner from '@/components/loading/Spinner'
import SkeletonCard from '@/components/loading/SkeletonCard'
import Pagination from '@/components/Pagination'
import SearchBar from '@/components/SearchBar'
import SortDropdown from '@/components/SortDropdown'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [sort, setSort] = useState({
    field: 'createdAt',
    direction: 'desc'
  })

  const fetchProjects = async (page = 1, search = searchTerm, showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      
      const response = await fetch(
        `/api/projects?page=${page}&limit=5${search ? `&search=${encodeURIComponent(search)}` : ''}&sortField=${sort.field}&sortDirection=${sort.direction}`
      )
      if (!response.ok) throw new Error('Erro ao carregar projetos')
      
      const data = await response.json()
      setProjects(data.projects)
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.pages,
        total: data.pagination.total
      })
    } catch (err) {
      toast.error('Erro ao carregar projetos')
      setError(err.message)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (id) => {
    const toastLoading = toast.loading('Excluindo projeto...')

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Erro ao excluir projeto')
      
      setProjects(projects.filter(project => project.id !== id))
      toast.success('Projeto excluído com sucesso!', {
        id: toastLoading,
      })
    } catch (err) {
      toast.error('Erro ao excluir projeto', {
        id: toastLoading,
      })
    }
  }

  const handlePageChange = (page) => {
    fetchProjects(page)
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
    fetchProjects(1, value, false)
  }

  const handleSort = (field) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
    fetchProjects(1)
  }

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32" />
      </div>
      <div className="grid gap-4">
        {[1,2,3].map(i => <SkeletonCard key={i} />)}
      </div>
    </div>
  )

  if (error) return <div className="text-center p-8 text-red-500">Erro: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">NexTrack - Strategic Project Management</h1>
        <Link 
          href="/projects/new" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          New Project
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <SearchBar 
            onSearch={handleSearch}
            initialValue={searchTerm}
          />
        </div>
        <SortDropdown
          currentSort={sort}
          onSort={handleSort}
        />
      </div>

      <div className="grid gap-4">
        {projects.map(project => (
          <div key={project.id} className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{project.name}</h2>
                <p className="text-gray-600">EID: {project.eid}</p>
                <p className="mt-2">{project.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Início: {format(new Date(project.startDate), 'dd/MM/yyyy', { locale: ptBR })}</p>
                  <p>Fim: {format(new Date(project.endDate), 'dd/MM/yyyy', { locale: ptBR })}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/projects/${project.id}/edit`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setConfirmDelete({ show: true, id: project.id })}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />

      <div className="text-center text-sm text-gray-500 mt-4">
        Total de projetos: {pagination.total}
      </div>

      <ConfirmDialog
        isOpen={confirmDelete.show}
        onClose={() => setConfirmDelete({ show: false, id: null })}
        onConfirm={() => {
          handleDelete(confirmDelete.id)
          setConfirmDelete({ show: false, id: null })
        }}
        title="Confirmar exclusão"
        message="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
      />
    </div>
  )
}
