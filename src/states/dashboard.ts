import { atom } from 'recoil'
import { v4 as uuidv4 } from 'uuid'
import { ViewMode } from '@src/types/dashboard'

export const dashboardState = atom<{
  view: ViewMode | null
  userId: number | null
}>({
  key: `dashboardState/${uuidv4()}`,
  default: {
    view: null,
    userId: null,
  },
})
