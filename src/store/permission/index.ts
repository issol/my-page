// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'src/configs/axios'
import { PermissionObjectType, RoleType } from 'src/context/types'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

/* TODO : 개발 후 Test data 지우기 */
export const getPermission = createAsyncThunk(
  'permissions/gerPermissions',
  async (): Promise<PermissionObjectType> => {
    try {
      // const { data } = await axios.get(`/api/enough/a/role/map`)
      // console.log('permission : ', data)
      return [
        {
          subject: 'members',
          can: ['read', 'create', 'update', 'delete'],
        },
        {
          subject: 'permission_request',
          can: ['read', 'create', 'update', 'delete'],
        },
        {
          subject: 'personalInfo_pro',
          can: ['read', 'create', 'update', 'delete'],
        },
        {
          subject: 'personalInfo_manager',
          can: ['read', 'create', 'update', 'delete'],
        },
        {
          subject: 'dashboards',
          can: ['read', 'create', 'update', 'delete'],
        },
        {
          subject: 'onboarding',
          can: ['read', 'create', 'update', 'delete'],
        },
        {
          subject: 'client_guideline',
          can: ['read', 'create', 'update', 'delete'],
        },
        {
          subject: 'contract',
          can: ['read', 'create', 'update', 'delete'],
        },
        {
          subject: 'recruiting',
          can: ['read', 'create', 'update', 'delete'],
        },
        {
          subject: 'job_posting',
          can: ['read', 'create', 'update', 'delete'],
        },
      ]
      // return data
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
      // return { roles: ['TAD', 'MASTER'] }
      return data
    } catch (e: any) {
      throw new Error('getRole error : ', e)
    }
  },
)

const initialState: {
  isLoading: boolean
  permission: PermissionObjectType
  role: Array<RoleType>
} = {
  permission: [],
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
