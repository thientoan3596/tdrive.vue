import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJwt } from './useJwt'
import { ExpiredTokenError, parseResponse } from '@/utils/errors'
/**
 * A composable function for making DELETE requests.
 */
export function useDelete() {
  const router = useRouter()
  const isLoading = ref(false)
  const error = ref<null | string>(null)
  const { refreshJwt, getToken } = useJwt()
  const _delete = async (url: string, useJwt: boolean = false): Promise<void> => {
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
              throw Error('Not Authenticated')
            }
          }
        }
        headers['Authorization'] = `Bearer ${token}`
      }
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      })
      if (!response.ok) {
        let errorData = await parseResponse(response)
        throw errorData
      }
      return
    } catch (err: any) {
      error.value = err.message || 'An unexpected error occurred'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, _delete }
}
