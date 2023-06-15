import { createSlice, Slice } from '@reduxjs/toolkit'
import { InvoicePayableDownloadData } from '@src/types/invoice/payable.type'

type ReducerType = {
  invoicePayableData: InvoicePayableDownloadData | null
  lang: 'EN' | 'KO'
  isReady: boolean
}
const initialState: ReducerType = {
  invoicePayableData: null,
  lang: 'EN',
  isReady: false,
}

export const invoicePayableSlice: Slice<ReducerType> = createSlice({
  name: 'invoicePayable',
  initialState,
  reducers: {
    setInvoicePayable: (state, action) => {
      state.invoicePayableData = action.payload
      state.isReady = true
    },

    setInvoicePayableLang: (state, action) => {
      state.lang = action.payload
    },

    setInvoicePayableIsReady(state) {
      state.isReady = false
    },
  },
})

export const {
  setInvoicePayable,
  setInvoicePayableLang,
  setInvoicePayableIsReady,
} = invoicePayableSlice.actions
export default invoicePayableSlice.reducer
