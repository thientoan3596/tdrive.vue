import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJwt } from './useJwt'
import { ExpiredTokenError, parseResponse } from '@/utils/errors'
export function usePost<Payload, ResponseData = void>() {
  const router = useRouter()
  const isLoading = ref(false)
  const error = ref<null | string>(null)
  const rData = ref<ResponseData | null>(null)
  const { refreshJwt, getToken } = useJwt()
  /**
   * NB! The method DOES apply parseResponse() at the end
   */
  const post = async (
    url: string,
    payload: Payload,
    options: { useJwt?: boolean; isFormData?: boolean } = {},
  ): Promise<ResponseData> => {
    isLoading.value = true
    error.value = null
    try {
      const headers: Record<string, string> = {}
      if (options.useJwt) {
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
      let body: BodyInit
      if (options.isFormData && payload instanceof FormData) {
        body = payload
      } else {
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify(payload)
      }
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
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

  return { isLoading, rData, error, post }
}
