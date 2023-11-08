import { createSlice, createAsyncThunk, Slice } from '@reduxjs/toolkit'
import { ItemType } from '@src/types/common/item.type'
import { InvoiceDownloadData } from '@src/types/invoice/receivable.type'
import { LanguagePairTypeInItem } from '@src/types/orders/order-detail'

const initialState: {
  invoiceTotalData: InvoiceDownloadData | null
  lang: 'EN' | 'KO'
  isReady: boolean
} = {
  invoiceTotalData: null,
  lang: 'EN',
  isReady: false,
}

export const invoiceSlice: Slice<{
  invoiceTotalData: InvoiceDownloadData | null
  lang: 'EN' | 'KO'
  isReady: boolean
}> = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setInvoice: (state, action) => {
      state.invoiceTotalData = action.payload
      state.isReady = true
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
    setIsReady(state, action) {
      state.isReady = action.payload
    },
  },
})

export const {
  setInvoice,
  resetInvoice,
  setInvoiceLang,
  resetInvoiceLang,
  setIsReady,
} = invoiceSlice.actions
export default invoiceSlice.reducer
