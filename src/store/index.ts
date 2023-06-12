// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import userAccess from './permission'
import modal from './modal'
import order from './order'
import quote from './quote'
import invoice from './invoice'

export const store = configureStore({
  reducer: {
    userAccess,
    modal,
    order,
    quote,
    invoice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
