import { OrderDownloadData } from '@src/types/orders/order-detail'
import { createSlice, createAsyncThunk, Slice } from '@reduxjs/toolkit'

const initialState: {
  orderTotalData: OrderDownloadData | null
  lang: 'EN' | 'KO'
  isReady: boolean
} = {
  orderTotalData: null,
  lang: 'EN',
  isReady: false,
}
export const orderSlice: Slice<{
  orderTotalData: OrderDownloadData | null
  lang: 'EN' | 'KO'
  isReady: boolean
}> = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder: (state, action) => {
      state.orderTotalData = action.payload
      state.isReady = true
    },
    resetOrder: state => {
      state.orderTotalData = initialState.orderTotalData
    },

    setOrderLang: (state, action) => {
      state.lang = action.payload
    },

    resetOrderLang: state => {
      state.lang = initialState.lang
    },
    setIsReady(state, action) {
      state.isReady = action.payload
    },
  },
})

export const {
  setOrder,
  resetOrder,
  setOrderLang,
  resetOrderLang,
  setIsReady,
} = orderSlice.actions
export default orderSlice.reducer
