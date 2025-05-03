import type { JwtPayload } from 'jwt-decode'
export enum ItemType {
  File = 'File',
  Folder = 'Folder',
}
export type StorageItem = {
  id: string
  name: string
  type: ItemType
  extension: string
  size: number
  parentId: string
  children: StorageItem[]
  owner: string
}
export interface FormSubmitEvent {
  valid: boolean
}

export type AuthenticationResponse = {
  accessToken: string
  refreshToken: string
}

export type CustomJwtPayload = JwtPayload & {
  role: string
  name: string
  id: string
  email: string
}
export type AuthenticationPayload = {
  email: string
  password: string
}
export type RegistrationPayload = {
  name: string
  email: string
  password: string
  passwordConfirm: string
}
export type ValidationErrors = Record<string, string>
export type SpringValidationError = {
  field: string
  defaultMessage: string
}
