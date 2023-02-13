export type loginResType = {
  userId: number
  email: string
  accessToken: string
}

export type LoginResTypeWithOptionalAccessToken = loginResType & {
  accessToken?: string
}
