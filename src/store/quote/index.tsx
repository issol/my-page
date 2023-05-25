import { createSlice, createAsyncThunk, Slice } from '@reduxjs/toolkit'
import { QuoteDownloadData } from '@src/types/common/quotes.type'

const initialState: {
  quoteTotalData: QuoteDownloadData | null
  lang: 'EN' | 'KO'
} = {
  quoteTotalData: null,
  lang: 'EN',
}

export const quoteSlice: Slice<{
  quoteTotalData: QuoteDownloadData | null
  lang: 'EN' | 'KO'
}> = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    setQuote: (state, action) => {
      state.quoteTotalData = action.payload
    },
    resetQuote: state => {
      state.quoteTotalData = initialState.quoteTotalData
    },

    setQuoteLang: (state, action) => {
      state.lang = action.payload
    },

    resetQuoteLang: state => {
      state.lang = initialState.lang
    },
  },
})

export const { setQuote, resetQuote, setQuoteLang, resetQuoteLang } =
  quoteSlice.actions
export default quoteSlice.reducer
