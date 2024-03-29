import { createSlice, isAnyOf } from "@reduxjs/toolkit"
import { appActions } from "app/app.slise"
import { authAPI, LoginParamsType } from "features/auth/api/auth.api"
import { clearTasksAndTodolists } from "common/actions"
import { createAppAsyncThunk } from "common/utils"
import { ResultCode } from "common/enums"
import { thunkTryCatch } from "common/utils/thunk-try-catch"

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        authThunks.login.fulfilled,
        authThunks.logout.fulfilled,
        authThunks.initializeApp.fulfilled,
      ),
      (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      },
    )
  },
})

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  `${slice.name}/login`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    const res = await authAPI.login(arg)
    if (res.data.resultCode === ResultCode.Success) {
      return { isLoggedIn: true }
    } else {
      return rejectWithValue(res.data)
    }
  },
)

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
  `${slice.name}/logout`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    const res = await authAPI.logout()
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(clearTasksAndTodolists())
      return { isLoggedIn: false }
    } else {
      return rejectWithValue(null)
    }
  },
)

//task
const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>(
  `${slice.name}/initializeApp`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await authAPI.me()
      if (res.data.resultCode === ResultCode.Success) {
        return { isLoggedIn: true }
      } else {
        return rejectWithValue(res.data)
      }
    }).finally(() => {
      dispatch(appActions.setAppInitialized({ isInitialized: true }))
    })
  },
)

export const authSlice = slice.reducer
export const authThunks = { login, logout, initializeApp }
