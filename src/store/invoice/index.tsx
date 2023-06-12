import { createSlice, createAsyncThunk, Slice } from '@reduxjs/toolkit'
import { InvoiceDownloadData } from '@src/types/invoice/receivable.type'

const initialState: {
  invoiceTotalData: InvoiceDownloadData | null
  lang: 'EN' | 'KO'
} = {
  invoiceTotalData: null,
  lang: 'EN',
}

export const invoiceSlice: Slice<{
  invoiceTotalData: InvoiceDownloadData | null
  lang: 'EN' | 'KO'
}> = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setInvoice: (state, action) => {
      state.invoiceTotalData = action.payload
    },
    resetInvoice: state => {
      state.invoiceTotalData = initialState.invoiceTotalData
    },

    setInvoiceLang: (state, action) => {
      state.lang = action.payload
    },

    resetInvoiceLang: state => {
      state.lang = initialState.lang
    },
  },
})

export const { setInvoice, resetInvoice, setInvoiceLang, resetInvoiceLang } =
  invoiceSlice.actions
export default invoiceSlice.reducer
