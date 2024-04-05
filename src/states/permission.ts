import { DefaultValue, atom, selector, selectorFamily } from 'recoil'
import axios from 'src/configs/axios'
import { PermissionObjectType, UserRoleType } from 'src/context/types'
import { v4 as uuidv4 } from 'uuid'
import { authState } from './auth'

import authConfig from 'src/configs/auth'
import moment from 'moment'

const sessionStorage =
  typeof window !== 'undefined' ? window.sessionStorage : undefined

const sessionStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    if (sessionStorage) {
      const savedValue = sessionStorage.getItem(key)
      // setSelf -> Callbacks to set or reset the value of the atom.
      if (savedValue !== null) {
        setSelf(JSON.parse(savedValue))
      }

      // onSet -> Subscribe to changes in the atom value.
      onSet((newValue: any, _: any, isReset: boolean) => {
        isReset
          ? sessionStorage.removeItem(key)
          : sessionStorage.setItem(key, JSON.stringify(newValue))
      })
    }
  }

export const permissionState = atom<PermissionObjectType>({
  key: `permission-${uuidv4()}`,
  default: [{ subject: 'none', can: 'read' }],
})

export const roleState = atom<Array<UserRoleType>>({
  key: `role-${uuidv4()}`,
  default: [],
})

export const currentRoleState = atom<UserRoleType | null>({
  key: `currentRole-${uuidv4()}`,
  default: null,
  effects: [sessionStorageEffect(authConfig.currentRole)],
})

const timezoneState = atom<
  Array<{
    offset: number
    offsetFormatted: string
    timezone: string
    timezoneCode: string
  }>
>({
  key: `timezoneState/${uuidv4()}`,
  default: [],
})

export const roleSelector = selector<Array<UserRoleType>>({
  key: `permission/role-${uuidv4()}`,
  get: async ({ get }) => {
    const isLogin = get(authState).user !== null
    const userId = get(authState).user?.id

    if (isLogin && !!userId) {
      const { data } = await axios.get(
        `/api/enough/a/role/rels?userId=${userId}`,
      )

      return data.roles
    }
  },
  set: ({ get, set }, newValue: Array<UserRoleType> | DefaultValue) => {
    set(roleState, newValue as Array<UserRoleType>)
  },
})

export const currentRoleSelector = selector<UserRoleType | null>({
  key: `permission/currentRole-${uuidv4()}`,
  get: ({ get }) => {
    return get(currentRoleState)
  },
  set: ({ get, set }, newValue: UserRoleType | null | DefaultValue) => {
    set(currentRoleState, newValue as UserRoleType | null)
  },
})

export const timezoneSelector = selector<
  Array<{
    offset: number
    offsetFormatted: string
    timezone: string
    timezoneCode: string
  }>
>({
  key: `timezone-${uuidv4()}`,
  get: ({ get }) => {
    return get(timezoneState)
  },
  set: (
    { get, set },
    newValue:
      | Array<{
          offset: number
          offsetFormatted: string
          timezone: string
          timezoneCode: string
        }>
      | DefaultValue,
  ) => {
    set(
      timezoneState,
      newValue as Array<{
        offset: number
        offsetFormatted: string
        timezone: string
        timezoneCode: string
      }>,
    )
  },
})

export const permissionSelector = selector<PermissionObjectType>({
  key: `permission/selector-${uuidv4()}`,
  get: async ({ get }) => {
    const isLogin = get(authState).user !== null

    if (isLogin) {
      if (process.env.NODE_ENV !== 'development') {
        const { data } = await axios.get(`/api/enough/a/role/map`)
        return data
      } else {
        return [
          {
            subject: 'permission_request',
            can: 'read',
          },

          {
            subject: 'permission_request',
            can: 'update',
          },
          {
            subject: 'my_page',
            can: 'read',
          },
          {
            subject: 'personalInfo_pro',
            can: 'update',
          },
          {
            subject: 'personalInfo_manager',
            can: 'read',
          },
          {
            subject: 'personalInfo_manager',
            can: 'update',
          },
          {
            subject: 'members',
            can: 'read',
          },
          {
            subject: 'onboarding',
            can: 'read',
          },
          {
            subject: 'jobs',
            can: 'read',
          },
          {
            subject: 'certification_test',
            can: 'create',
          },
          {
            subject: 'certification_test',
            can: 'read',
          },
          {
            subject: 'certification_test',
            can: 'update',
            option: {
              authorId: 17,
            },
          },
          {
            subject: 'certification_test',
            can: 'delete',
            option: {
              authorId: 17,
            },
          },
          {
            subject: 'recruiting',
            can: 'create',
          },
          {
            subject: 'recruiting',
            can: 'read',
          },
          {
            subject: 'recruiting',
            can: 'update',
            option: {
              authorId: 5,
            },
          },
          {
            subject: 'job_posting',
            can: 'create',
          },
          {
            subject: 'job_posting',
            can: 'read',
          },
          {
            subject: 'job_posting',
            can: 'update',
          },
          {
            subject: 'job_posting',
            can: 'delete',
          },
          {
            subject: 'client_guideline',
            can: 'read',
          },
          {
            subject: 'client_guideline',
            can: 'create',
          },
          {
            subject: 'client_guideline',
            can: 'update',
            option: {
              authorId: 5,
            },
          },
          {
            subject: 'client_guideline',
            can: 'delete',
            option: {
              authorId: 5,
            },
          },
          {
            subject: 'contract',
            can: 'read',
          },
          {
            subject: 'contract',
            can: 'create',
          },
          {
            subject: 'contract',
            can: 'update',
            option: {
              authorId: 5,
            },
          },
          {
            subject: 'contract',
            can: 'delete',
            option: {
              authorId: 5,
            },
          },
          {
            subject: 'personalInfo_pro',
            can: 'read',
          },
          {
            subject: 'onboarding_comment',
            can: 'update',
            option: {
              authorId: 5,
            },
          },
          {
            subject: 'onboarding_comment',
            can: 'delete',
            option: {
              authorId: 5,
            },
          },
          {
            subject: 'pro_comment',
            can: 'create',
          },
          {
            subject: 'pro_comment',
            can: 'update',
            option: {
              authorId: 5,
            },
          },
          {
            subject: 'pro_comment',
            can: 'read',
          },
          {
            subject: 'pro_comment',
            can: 'delete',
            option: {
              authorId: 5,
            },
          },
          {
            subject: 'members',
            can: 'read',
          },
          {
            subject: 'my_account',
            can: 'read',
          },
          {
            subject: 'pro',
            can: 'read',
          },
          {
            subject: 'pro',
            can: 'create',
          },
          {
            subject: 'pro',
            can: 'update',
          },
          {
            subject: 'pro',
            can: 'delete',
          },
          {
            subject: 'account_manage',
            can: 'read',
          },
          {
            subject: 'account_manage',
            can: 'update',
          },
          {
            subject: 'account_manage',
            can: 'delete',
          },
          {
            subject: 'account_manage',
            can: 'create',
          },
          {
            subject: 'company_info',
            can: 'read',
          },
          {
            subject: 'company_price',
            can: 'read',
          },

          {
            subject: 'company_price',
            can: 'create',
          },
          {
            subject: 'company_price',
            can: 'update',
          },
          {
            subject: 'company_price',
            can: 'delete',
          },
          {
            subject: 'client',
            can: 'read',
          },
          {
            subject: 'client',
            can: 'create',
          },
          {
            subject: 'client',
            can: 'update',
          },
          {
            subject: 'client',
            can: 'delete',
          },
          {
            subject: 'client_comment',
            can: 'read',
          },
          {
            subject: 'client_comment',
            can: 'create',
          },
          {
            subject: 'client_comment',
            can: 'update',
            option: {
              authorId: 5,
            },
          },
          {
            subject: 'client_comment',
            can: 'delete',
          },
          {
            subject: 'quote',
            can: 'read',
          },
          {
            subject: 'quote',
            can: 'create',
          },
          {
            subject: 'quote',
            can: 'update',
          },
          {
            subject: 'quote',
            can: 'delete',
          },
          {
            subject: 'order',
            can: 'read',
          },
          {
            subject: 'order',
            can: 'create',
          },
          {
            subject: 'order',
            can: 'update',
          },
          {
            subject: 'order',
            can: 'delete',
          },
          {
            subject: 'job_list',
            can: 'read',
          },
          {
            subject: 'job_list',
            can: 'create',
          },
          {
            subject: 'job_list',
            can: 'update',
          },
          {
            subject: 'job_list',
            can: 'delete',
          },
          {
            subject: 'invoice_pro',
            can: 'read',
          },
          {
            subject: 'invoice_receivable',
            can: 'read',
          },
          {
            subject: 'invoice_receivable',
            can: 'create',
          },
          {
            subject: 'invoice_receivable',
            can: 'update',
          },
          {
            subject: 'invoice_receivable',
            can: 'delete',
          },
          {
            subject: 'invoice_payable',
            can: 'read',
          },
          {
            subject: 'invoice_payable',
            can: 'create',
          },
          {
            subject: 'invoice_payable',
            can: 'update',
          },
          {
            subject: 'invoice_payable',
            can: 'delete',
          },
          {
            subject: 'client_request',
            can: 'read',
          },
          {
            subject: 'client_request',
            can: 'create',
          },
          {
            subject: 'client_request',
            can: 'update',
          },
          {
            subject: 'client_request',
            can: 'delete',
          },
          {
            subject: 'lpm_request',
            can: 'read',
          },
          {
            subject: 'lpm_request',
            can: 'create',
          },
          {
            subject: 'lpm_request',
            can: 'update',
          },
          {
            subject: 'lpm_request',
            can: 'delete',
          },
          {
            subject: 'pro_mypage',
            can: 'read',
          },
          {
            subject: 'pro_mypage',
            can: 'create',
          },
          {
            subject: 'pro_mypage',
            can: 'update',
          },
          {
            subject: 'pro_mypage',
            can: 'delete',
          },

          {
            subject: 'pro_payment',
            can: 'read',
          },
          {
            subject: 'pro_payment',
            can: 'create',
          },
          {
            subject: 'pro_payment',
            can: 'update',
          },
          {
            subject: 'pro_payment',
            can: 'delete',
          },
          {
            subject: 'client_payment',
            can: 'read',
          },
          {
            subject: 'client_payment',
            can: 'create',
          },
          {
            subject: 'client_payment',
            can: 'update',
          },
          {
            subject: 'client_payment',
            can: 'delete',
          },
          {
            subject: 'pro_certification_test',
            can: 'read',
          },
          // 대시보드
          {
            can: 'read',
            subject: 'dashboard_ACCOUNT',
          },
          {
            can: 'read',
            subject: 'dashboard_CLIENT',
          },
          {
            can: 'read',
            subject: 'dashboard_LPM',
          },
          {
            can: 'read',
            subject: 'dashboard_TAD',
          },
          { can: 'read', subject: 'dashboard_PRO' },
          {
            can: 'read',
            subject: 'linguist_team',
          },
          {
            can: 'update',
            subject: 'linguist_team',
          },
          {
            can: 'delete',
            subject: 'linguist_team',
          },
        ]
      }
    }
  },
  set: ({ get, set }, newValue: PermissionObjectType | DefaultValue) => {
    set(permissionState, newValue as PermissionObjectType)
  },
})
