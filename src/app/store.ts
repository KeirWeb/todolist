import { todolistsReducer } from "features/TodolistsList/model/todolists.slise"
import { appReducer } from "app/app.slise"
import { authSlice } from "features/auth/model/auth.slice"
import { tasksReducer } from "features/TodolistsList/model/tasks.slise"
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authSlice,
  },
})

export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
