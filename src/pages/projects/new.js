import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Spinner from '@/components/loading/Spinner'
import ProgressBar from '@/components/loading/ProgressBar'
import useUnsavedChanges from '@/hooks/useUnsavedChanges'
import {
  isValidDate,
  isDateInPast,
  isEndDateValid,
  formatDateError,
  formatInvalidDateError,
  formatPastDateError
} from '@/utils/dateValidation'

export default function NewProject() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    eid: '',
    description: '',
    startDate: '',
    endDate: ''
  })
  const [errors, setErrors] = useState({})

  const { setIsDirty } = useUnsavedChanges(formData, loading)

  // Validação em tempo real
  useEffect(() => {
    const newErrors = {}

    if (formData.startDate) {
      if (!isValidDate(formData.startDate)) {
        newErrors.startDate = formatInvalidDateError('data de início')
      } else if (isDateInPast(formData.startDate)) {
        newErrors.startDate = formatPastDateError('data de início')
      }
    }

    if (formData.endDate) {
      if (!isValidDate(formData.endDate)) {
        newErrors.endDate = formatInvalidDateError('data de término')
      } else if (isDateInPast(formData.endDate)) {
        newErrors.endDate = formatPastDateError('data de término')
      }
    }

    if (formData.startDate && formData.endDate && 
        isValidDate(formData.startDate) && isValidDate(formData.endDate)) {
      if (!isEndDateValid(formData.startDate, formData.endDate)) {
        newErrors.endDate = formatDateError(formData.startDate, formData.endDate)
      }
    }

    setErrors(newErrors)
  }, [formData.startDate, formData.endDate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validação final antes de enviar
    if (Object.keys(errors).length > 0) {
      toast.error('Por favor, corrija os erros antes de salvar')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar projeto')
      }
      
      setIsDirty(false)
      toast.success('Projeto criado com sucesso!')
      router.push('/')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">New Project</h1>
      {loading && <ProgressBar progress={50} />}

      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">EID</label>
          <input
            type="text"
            name="eid"
            value={formData.eid}
            onChange={handleChange}
            required
            maxLength={20}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Begin Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className={`w-full border rounded p-2 ${
              errors.startDate ? 'border-red-500' : ''
            }`}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className={`w-full border rounded p-2 ${
              errors.endDate ? 'border-red-500' : ''
            }`}
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 
                     disabled:bg-blue-300 disabled:cursor-not-allowed
                     flex items-center gap-2"
          >
            {loading ? (
              <>
                <Spinner size="sm" light />
                <span>Saving...</span>
              </>
            ) : 'Save'}
          </button>
          <Link
            href="/"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
} 