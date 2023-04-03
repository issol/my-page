// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import userAccess from './permission'

export const store = configureStore({
  reducer: {
    userAccess,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
