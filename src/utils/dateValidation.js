export function isValidDate(dateString) {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date)
}

export function isDateInPast(dateString) {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

export function isEndDateValid(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return start <= end
}

export function formatDateError(startDate, endDate) {
  return 'A data de término deve ser igual ou posterior à data de início'
}

export function formatInvalidDateError(fieldName) {
  return `Por favor, insira uma data válida para ${fieldName}`
}

export function formatPastDateError(fieldName) {
  return `A ${fieldName} não pode estar no passado`
} 