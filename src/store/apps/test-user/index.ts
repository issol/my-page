// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { PolicyType } from 'src/configs/acl'

interface DataParams {
  role: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Users
export const fetchTestUser = createAsyncThunk(
  'appUsers/fetchData',
  async (params: DataParams) => {
    const response = await axios.get('/api/test-users/data', {
      params: { role: params.role },
    })

    return response.data
  },
)

export const updatePolicy = createAsyncThunk(
  'appUsers/updatePolicy',
  async (
    params: { id: number; policy: PolicyType },
    { getState, dispatch }: Redux,
  ) => {
    const response = await axios.post('/api/test-users/update-policy', {
      params: { id: params.id, policy: params.policy },
    })

    dispatch(fetchTestUser(getState().user.params))

    return response.data
  },
)

// ** Add User
export const addTestUser = createAsyncThunk(
  'appUsers/addUser',
  async (
    data: { [key: string]: number | string },
    { getState, dispatch }: Redux,
  ) => {
    const response = await axios.post('/apps/test-users/add-user', {
      data,
    })
    dispatch(fetchTestUser(getState().user.params))

    return response.data
  },
)

// ** Delete User
export const deleteTestUser = createAsyncThunk(
  'appUsers/deleteUser',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axios.delete('/apps/test-users/delete', {
      data: id,
    })
    dispatch(fetchTestUser(getState().user.params))

    return response.data
  },
)

export const appTestUsersSlice = createSlice({
  name: 'appTestUsers',
  initialState: {
    users: [],
    total: 1,
    params: {},
    allData: [],
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchTestUser.fulfilled, (state, action) => {
      state.users = action.payload.users
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  },
})

export default appTestUsersSlice.reducer
