// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk, Slice } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'src/configs/axios'
import { PermissionObjectType, UserRoleType } from 'src/context/types'

/* TODO : 개발 후 Test data 지우기 */
export const getPermission = createAsyncThunk(
  'permissions/gerPermissions',
  async (): Promise<PermissionObjectType> => {
    try {
      if (process.env.NODE_ENV !== 'development') {
        const { data } = await axios.get(`/api/enough/a/role/map`)
        return data
      } else {
        return []
      }
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
  currentRole: UserRoleType | null
} = {
  permission: [{ subject: 'none', can: 'read' }],
  role: [],
  isLoading: false,
  currentRole: null,
}

export const permissionSlice: Slice<{
  isLoading: boolean
  permission: PermissionObjectType
  role: Array<UserRoleType>
  currentRole: UserRoleType | null
}> = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    resetRole: state => {
      state.role = []
    },
    setCurrentRole: (state, action) => {
      // console.log(action)

      state.currentRole = action.payload
    },
  },
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

export const { resetRole, setCurrentRole } = permissionSlice.actions

export default permissionSlice.reducer
