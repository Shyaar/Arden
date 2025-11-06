export interface ValidationError {
  field: string
  message: string
}

export function validateEmail(email: string): ValidationError | null {
  if (!email.trim()) {
    return { field: "email", message: "Email is required" }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { field: "email", message: "Please enter a valid email" }
  }
  return null
}

export function validateRequired(value: string, fieldName: string): ValidationError | null {
  if (!value.trim()) {
    return { field: fieldName, message: `${fieldName} is required` }
  }
  return null
}



export function validateNumber(value: string, fieldName: string): ValidationError | null {

  if (!/^[0-9]+$/.test(value)) {

    return { field: fieldName, message: `${fieldName} must be a number` }

  }

  if (Number(value) <= 0) {

    return { field: fieldName, message: `${fieldName} must be greater than 0` }

  }

  return null

}

export function validateMinLength(value: string, fieldName: string, minLength: number): ValidationError | null {
  if (value.trim().length < minLength) {
    return { field: fieldName, message: `${fieldName} must be at least ${minLength} characters` }
  }
  return null
}
