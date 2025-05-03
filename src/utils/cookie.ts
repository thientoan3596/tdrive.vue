export function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue
  }
  return undefined
}

export function saveToCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/;  Secure; SameSite=Strict;`
}
