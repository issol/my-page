import { ClientUserType, UserDataType } from '@src/context/types'
import { getUserDataFromBrowser } from '@src/shared/auth/storage'
import { atom } from 'recoil'
import { v4 as uuidv4 } from 'uuid'

const authState = atom<{
  user: UserDataType | null
  company: ClientUserType | undefined | null
  loading: boolean
}>({
  key: `authState/${uuidv4()}`,
  default: {
    user: null,
    company: undefined,
    loading: true,
  },
})

export { authState }
