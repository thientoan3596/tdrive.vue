import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJwt } from './useJwt'
import { ExpiredTokenError, parseResponse } from '@/utils/errors'

/**
 * A composable function for making GET requests.
 *
 * @template Data - The base data type.
 * @template ParsedResponse - The expected response type from the GET request (defaults to `T`).
 */
export function useGet<Data, ParsedResponse = Data>() {
  const router = useRouter()
  const isLoading = ref(false)
  const error = ref<null | string>(null)
  const rData = ref<Data | null>(null)
  const { refreshJwt, getToken } = useJwt()
  /**
   * NB! The method DOES apply parseResponse() at the end
   */
  const get = async (url: string, useJwt: boolean = false): Promise<ParsedResponse> => {
    isLoading.value = true
    error.value = null
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
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
        let errorData = await parseResponse(response)
        throw errorData
      }
      rData.value = await parseResponse(response)
      return rData.value
    } catch (err: any) {
      error.value = err.message || 'An unexpected error occurred'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, rData, error, get }
}
