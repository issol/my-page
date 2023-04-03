// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'src/configs/axios'
import { PermissionObjectType, UserRoleType } from 'src/context/types'

/* TODO : 개발 후 Test data 지우기 */
export const getPermission = createAsyncThunk(
  'permissions/gerPermissions',
  async (): Promise<PermissionObjectType> => {
    try {
      // const { data } = await axios.get(`/api/enough/a/role/map`)
      // return data
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
            authorId: 5,
          },
        },
        {
          subject: 'certification_test',
          can: 'delete',
          option: {
            authorId: 5,
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
      ]
    } catch (e: any) {
      throw new Error('getPermission error : ', e)
    }
  },
)

export const getRole = createAsyncThunk(
  'permissions/getRoles',
  async (userId: number) => {
    try {
      const { data } = await axios.get(
        `/api/enough/a/role/rels?userId=${userId}`,
      )
      return data
    } catch (e: any) {
      throw new Error('getRole error : ', e)
    }
  },
)

const initialState: {
  isLoading: boolean
  permission: PermissionObjectType
  role: Array<UserRoleType>
} = {
  permission: [{ subject: 'none', can: 'read' }],
  role: [],
  isLoading: false,
}

export const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getPermission.fulfilled, (state, action) => {
      state.permission = action.payload
      state.isLoading = false
    })
    builder.addCase(getPermission.pending, (state, action) => {
      state.permission = initialState.permission
      state.isLoading = true
    })
    builder.addCase(getPermission.rejected, (state, action) => {
      state.permission = initialState.permission
      state.isLoading = false
    })
    builder.addCase(getRole.fulfilled, (state, action) => {
      state.role = action.payload.roles
    })
    builder.addCase(getRole.rejected, (state, action) => {
      state.role = initialState.role
    })
  },
})

export default permissionSlice.reducer
