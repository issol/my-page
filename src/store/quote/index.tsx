import { createSlice, Slice } from '@reduxjs/toolkit'
import { QuoteDownloadData } from '@src/types/common/quotes.type'

type ReducerType = {
  quoteTotalData: QuoteDownloadData | null
  lang: 'EN' | 'KO'
  isReady: boolean
}
const initialState: ReducerType = {
  quoteTotalData: null,
  lang: 'EN',
  isReady: false,
}

export const quoteSlice: Slice<ReducerType> = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    setQuote: (state, action) => {
      state.quoteTotalData = action.payload
      state.isReady = true
    },
    resetQuote: state => {
      state.quoteTotalData = initialState.quoteTotalData
      state.isReady = false
    },

    setQuoteLang: (state, action) => {
      state.lang = action.payload
    },

    resetQuoteLang: state => {
      state.lang = initialState.lang
    },

    setIsReady(state) {
      state.isReady = false
    },
  },
})

export const {
  setQuote,
  resetQuote,
  setQuoteLang,
  resetQuoteLang,
  setIsReady,
  initRequest,
} = quoteSlice.actions
export default quoteSlice.reducer
