import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJwt } from './useJwt'
import { ExpiredTokenError, parseResponse } from '@/utils/errors'
/**
 * A composable function for making GET requests and handling file downloads.
 *
 * @template Data - The base data type.
 * @template ParsedResponse - The expected response type from the GET request (defaults to `T`).
 */
export function useDownload() {
  const router = useRouter()
  const isLoading = ref(false)
  const error = ref<null | string>(null)

  const { refreshJwt, getToken } = useJwt()

  /**
   * Make a GET request to fetch a file (e.g., ZIP) and trigger a download.
   *
   * @param url - The URL for the request.
   * @param useJwt - Whether or not to use JWT token for authorization.
   * @param fileName - The desired name for the downloaded file.
   */
  const download = async (url: string, useJwt: boolean = false) => {
    isLoading.value = true
    error.value = null
    try {
      const headers: Record<string, string> = {}
      if (useJwt) {
        let token = await getToken()
        if (token == undefined) {
          try {
            token = await refreshJwt()
          } catch (error: any) {
            if (error instanceof ExpiredTokenError) router.push('/signin')
            else {
              console.error(error)
            }
          }
        }
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
      })

      if (!response.ok) {
        const errorData = await parseResponse(response)
        throw errorData
      }
      const disposition = response.headers.get('Content-Disposition')
      const filenameMatch = /filename="(.+)"/.exec(disposition || '')
      const filename = filenameMatch ? filenameMatch[1] : 'download.zip'
      const blob = await response.blob()

      // Create an anchor element to trigger download
      const a = document.createElement('a')
      const urlBlob = window.URL.createObjectURL(blob)
      a.href = urlBlob
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()

      window.URL.revokeObjectURL(urlBlob)
    } catch (err: any) {
      error.value = err.message || 'An unexpected error occurred'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, download }
}
