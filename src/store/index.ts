// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers

import order from './order'
import quote from './quote'
import invoice from './invoice'
import invoicePayable from './invoice-payable'

export const store = configureStore({
  reducer: {
    order,
    quote,
    invoice,
    invoicePayable,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
