import { atom } from 'recoil'
import { v4 as uuidv4 } from 'uuid'
import { ViewMode } from '@src/types/dashboard'

export const dashboardState = atom<{ view: ViewMode; userId: number | null }>({
  key: `dashboardState/${uuidv4()}`,
  default: {
    view: 'company',
    userId: null,
  },
})
