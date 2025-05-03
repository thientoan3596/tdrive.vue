const BASE_URL = `/storage/v1`
export class StorageApi {
  static item = (id?: string) => {
    return `${BASE_URL}/${id || 'root'}`
  }
  static newFolder = () => {
    return `${BASE_URL}/folder`
  }
  static newFile = () => {
    return `${BASE_URL}/file`
  }
  static delete = (id: string) => {
    return `${BASE_URL}/${id}`
  }
  static download = (id: string) => {
    return `${BASE_URL}/download/${id}`
  }
}
