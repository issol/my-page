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

/* TODO : api완성 되면 end point 교체 및 리스폰스 수정 */
export const getPermission = createAsyncThunk(
  'permissions/gerPermissions',
  async (): Promise<PermissionObjectType> => {
    try {
      const { data } = await axios.get(`/api/enough/a/per/al`)

      return [
        {
          subject: 'members',
          can: ['read', 'create', 'delete'],
        },
        {
          subject: 'permission_request',
          can: ['read', 'update'],
        },
      ]
    } catch (e: any) {
      throw new Error('getPermission error : ', e)
    }
  },
)

export const getRole = createAsyncThunk(
  'permissions/gerPermissions',
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
  permission: PermissionObjectType
  role: Array<RoleType> | []
} = {
  permission: [{ subject: '', can: ['read'] }],
  role: [],
}

export const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getPermission.fulfilled, (state, action) => {
      state.permission = action.payload
    })
    builder.addCase(getPermission.rejected, (state, action) => {
      state.permission = initialState.permission
    })
    builder.addCase(getRole.fulfilled, (state, action) => {
      state.role = action.payload
    })
    builder.addCase(getRole.rejected, (state, action) => {
      state.role = initialState.role
    })
  },
})

export default permissionSlice.reducer
