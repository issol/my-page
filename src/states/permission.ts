import { DefaultValue, atom, selector, selectorFamily } from 'recoil'
import axios from 'src/configs/axios'
import { PermissionObjectType, UserRoleType } from 'src/context/types'
import { v4 as uuidv4 } from 'uuid'

interface PermissionState {
  permission: PermissionObjectType
}

interface RoleState {
  role: Array<UserRoleType>
}

interface CurrentRoleState {
  currentRole: UserRoleType | null
}

export const permissionState = atom<PermissionState>({
  key: 'permission',
  default: {
    permission: [{ subject: 'none', can: 'read' }],
  },
})

export const roleState = atom<RoleState>({
  key: 'role',
  default: {
    role: [],
  },
})

export const currentRoleState = atom<CurrentRoleState>({
  key: 'currentRole',
  default: {
    currentRole: null,
  },
})

export const roleSelector = selectorFamily<Array<UserRoleType>, number>({
  key: 'permission/role',
  get:
    (userId: number) =>
    async ({ get }) => {
      try {
        const { data } = await axios.get(
          `/api/enough/a/role/rels?userId=${userId}`,
        )
        return data
      } catch (e: any) {
        throw new Error('getRole error : ', e)
      }
    },
  // set: async ({ set, get }, newValue) => {
  //   const current: PermissionState = get(permissionState)

  //   set(permissionState, { ...current, role: newValue as Array<UserRoleType> })
  // },
})

export const currentRoleSelector = selector<UserRoleType | null>({
  key: 'permission/currentRole',
  get: ({ get }) => {
    return get(currentRoleState).currentRole
  },
  set: ({ get, set }, newValue: UserRoleType | null | DefaultValue) => {
    const current: PermissionState = get(permissionState)
    const newCurrentRole = {
      ...current,
      currentRole: newValue as UserRoleType | null,
    }
    set(permissionState, newCurrentRole)
  },
})

export const permissionSelector = selectorFamily<PermissionObjectType, boolean>(
  {
    key: `permission/selector-${uuidv4()}`,
    get:
      isLogin =>
      async ({ get }) => {
        if (isLogin) {
          try {
            if (process.env.NODE_ENV === 'development') {
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
                // {
                //   subject: 'account_manage',
                //   can: 'read',
                // },
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
              ]
            }
          } catch (e: any) {
            throw new Error('getPermission error : ', e)
          }
        }
      },
  },
)
