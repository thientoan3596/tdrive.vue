const BASE_URL = `/auth/v1`
export class AuthApi {
  static authenticate = () => {
    return `${BASE_URL}/authenticate`
  }
  static register = () => {
    return `${BASE_URL}/register`
  }
  static refreshToken = () => {
    return `${BASE_URL}/refresh-token`
  }
}
