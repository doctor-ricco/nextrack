import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function useUnsavedChanges(formData, isSubmitting = false) {
  const router = useRouter()
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    // Não marca como sujo se estiver submetendo o formulário
    // ou se não houver dados no formulário ainda
    if (!isSubmitting && Object.values(formData).some(value => value !== '')) {
      setIsDirty(true)
    }
  }, [formData, isSubmitting])

  useEffect(() => {
    // Função que será chamada antes do usuário sair da página
    const handleWindowClose = (e) => {
      if (!isDirty) return
      e.preventDefault()
      return (e.returnValue = 'Você tem alterações não salvas. Deseja realmente sair?')
    }

    // Função que será chamada antes de navegar para outra rota
    const handleBrowseAway = () => {
      if (!isDirty) return
      
      // Se estiver submetendo o formulário, permite a navegação
      if (isSubmitting) return true

      if (window.confirm('Você tem alterações não salvas. Deseja realmente sair?')) {
        return true
      }
      router.events.emit('routeChangeError')
      throw 'routeChange aborted'
    }

    window.addEventListener('beforeunload', handleWindowClose)
    router.events.on('routeChangeStart', handleBrowseAway)

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose)
      router.events.off('routeChangeStart', handleBrowseAway)
    }
  }, [isDirty, isSubmitting, router.events])

  return {
    setIsDirty
  }
} 