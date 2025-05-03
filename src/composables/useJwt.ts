import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import type { AuthenticationResponse, CustomJwtPayload } from '@/types'
import { getCookie, saveToCookie } from '@/utils/cookie'
import { ExpiredTokenError } from '@/utils/errors'
import { jwtDecode } from 'jwt-decode'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'

export function useJwt() {
  const toast = useToast()
  /**
   * Get jwt ACCESS TOKEN DIRECTLY from cookie
   */
  const getAccessToken = (): string | undefined => {
    return getCookie('jwtToken')
  }
  /**
   * Get jwt REFRESH TOKEN DIRECTLY from cookie
   */
  const getRefreshToken = (): string | undefined => {
    return getCookie('refreshToken')
  }
  const saveAccessToken = (token: string) => {
    saveToCookie('jwtToken', token)
  }
  const saveRefreshToken = (token: string) => {
    saveToCookie('refreshToken', token)
  }
  const clearAccessToken = () => {
    document.cookie = 'jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }
  const clearRefreshToken = () => {
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }
  /**
   * If jwtToken is expired
   */
  const isExpired = (tk?: string) => {
    if (!tk) return true
    const decoded = jwtDecode(tk)
    return !decoded.exp || Date.now() > decoded.exp * 1000
  }
  const token = ref<string | undefined>(getAccessToken())
  const refreshToken = ref<string | undefined>(getRefreshToken())
  /*
   * Save tokens to getCookie
   * NB! DOES call decodeJwt
   */
  const setTokens = async (authResponse: AuthenticationResponse) => {
    clearTokens()
    token.value = authResponse.accessToken
    refreshToken.value = authResponse.refreshToken
    saveAccessToken(authResponse.accessToken)
    saveRefreshToken(authResponse.refreshToken)
    await decodeJwt()
  }
  const clearTokens = () => {
    token.value = undefined
    refreshToken.value = undefined
    clearAccessToken()
    clearRefreshToken()
  }
  /**
   * Refresh access token!
   * throws if refresh token is not available or refresh token is expired
   * returns {string} new access token (if possible)
   */
  const refreshJwt = async () => {
    console.log('Refhresing token')
    if (!refreshToken.value) throw new Error('No refresh token available')
    try {
      const response = await fetch('/auth/v1/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getRefreshToken()}`,
        },
      })
      if (response.status === 401) {
        const text = await response.text()
        const tokenExpiredRegex = /token.*expired|expired.*token/i
        if (tokenExpiredRegex.test(text)) {
          clearRefreshToken()
          throw new ExpiredTokenError()
        } else {
          throw new Error('Error: ' + text)
        }
      }
      if (response.status == 423) {
        clearTokens()
        toast.add({
          severity: 'error',
          summary: 'Account locked',
          detail: 'Your account has been locked!',
          life: 3000,
        })
        router.push('/')
        return
      }
      if (!response.ok) throw new Error('Failed to refresh token')
      const data: AuthenticationResponse = await response.json()
      await setTokens(data)
      return data.accessToken
    } catch (error) {
      console.error('Error refreshing token:', error)
      clearTokens()
    }
  }
  /**
   * Getting access token!
   * Performing refresh if token is expired
   * Returns:
   *  - Token
   *  - undefined -  If token and refresh token are expired or both not exist
   */
  const getToken = async () => {
    if (token.value) {
      if (!isExpired(token.value)) return token.value
    }
    if (refreshToken.value) {
      if (!isExpired(refreshToken.value)) {
        await refreshJwt()
        return token.value
      }
    }
    return undefined
  }
  /**
   * Decode JWT and parse to user (store)
   */
  const decodeJwt = async () => {
    const token = await getToken()
    const user = useUserStore()
    if (!!token) {
      const decoded = jwtDecode<CustomJwtPayload>(token)
      user.setUser({ name: decoded.name, role: decoded.role, id: decoded.id })
    }
  }
  return { token, setTokens, clearTokens, refreshToken, refreshJwt, getToken, decodeJwt }
}
