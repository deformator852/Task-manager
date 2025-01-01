export interface CreateUserDTO {
  username: string
  password: string
  email: string
}

export interface LoginUserDTO {
  username: string
  password: string
  email?: string
}
