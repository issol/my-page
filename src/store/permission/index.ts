// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'src/configs/axios'
import { PermissionObjectType } from 'src/context/types'

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

/* TODO : 백엔드와 논의하여 데이터 타입 정의한 후 수정하기. */
export const gerPermission = createAsyncThunk(
  'permissions/gerPermissions',
  async () => {
    const { data } = await axios.get(`/api/enough/a/per/al`)

    return {
      RE0008: { subject: 'User', can: ['read', 'update'] },
      BU1152: { subject: 'Manager-Profile', can: ['read', 'update'] },
      BU1777: {
        subject: 'Pro-Profile',
        can: ['read', 'update'],
        option: { update: { authorOnly: true } },
      },
    }
  },
)

const initialState: { data: PermissionObjectType } = {
  data: { A00000: { subject: '', can: ['read'] } },
}

export const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(gerPermission.fulfilled, (state, action) => {
      state.data = action.payload
    })
  },
})

export default permissionSlice.reducer
