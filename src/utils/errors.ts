export class ExpiredTokenError extends Error {
  constructor(message?: string) {
    super(message)
  }
}
export function parseResponse(response: any) {
  const contentType = response.headers.get('Content-Type')
  if (response.status === 204) {
    return null
  }
  if (contentType?.includes('text/html')) {
    return response.text() // Handle HTML response
  } else if (contentType?.includes('application/json')) {
    return response.json()
  }
  console.warn('Unwrapping Unknown response type')
  return response.text()
}
