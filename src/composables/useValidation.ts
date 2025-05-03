import type { SpringValidationError, ValidationErrors } from '@/types'
import { reactive } from 'vue'

export function useValidation() {
  const validationErrors = reactive<ValidationErrors>({})
  const setValidationErrors = (springValidationErrors: SpringValidationError[]) => {
    springValidationErrors.forEach((e) => {
      validationErrors[e.field] = e.defaultMessage
    })
  }
  const resetValidationErrors = (field: string | undefined) => {
    if (!field)
      for (const key in validationErrors) {
        delete validationErrors[key]
      }
    else delete validationErrors[field]
  }
  return {
    validationErrors,
    setValidationErrors,
    resetValidationErrors,
  }
}
