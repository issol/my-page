// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { ReactNode } from 'react'

const initialState: Array<{ type: 'basic' | 'small'; children: ReactNode }> = []

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      const { type, children } = action.payload
      return state.concat({ type, children })
    },
    closeModal: (state, action) => {
      state.pop()
    },
  },
})

export const { openModal, closeModal } = modalSlice.actions
export default modalSlice.reducer
