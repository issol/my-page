// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type RoleType = 'CLIENT' | 'PRO' | 'LPM' | 'TAD'
export type UsersType = {
  id: number
  email: string
  role: Array<RoleType>
  company: string
  country: string
  firstName: string
  lastName: string
  middleName?: string
  extraData?: any

  /* TODO:하단의 값들은 불필요 또는 수정 필요 */
  status: string
  avatar?: string
  contact: string
  fullName: string
  username: string
  currentPlan: string
  avatarColor?: ThemeColor
}

export type ProjectListDataType = {
  id: number
  img: string
  hours: string
  totalTask: string
  projectType: string
  projectTitle: string
  progressValue: number
  progressColor: ThemeColor
}
