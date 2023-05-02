import { OrderDownloadData } from '@src/types/orders/order-detail'
import { createSlice, createAsyncThunk, Slice } from '@reduxjs/toolkit'

const initialState: {
  orderTotalData: OrderDownloadData | null
  lang: 'EN' | 'KO'
} = {
  orderTotalData: null,
  lang: 'EN',
}

export const orderSlice: Slice<{
  orderTotalData: OrderDownloadData | null
  lang: 'EN' | 'KO'
}> = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrder: (state, action) => {
      state.orderTotalData = action.payload
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
  },
})

export const { setOrder, resetOrder, setOrderLang, resetOrderLang } =
  orderSlice.actions
export default orderSlice.reducer
