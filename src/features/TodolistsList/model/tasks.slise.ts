import { createSlice, current, PayloadAction } from "@reduxjs/toolkit"
import { appActions, RequestStatusType } from "app/app.slise"
import { todolistsThunks } from "features/TodolistsList/model/todolists.slise"
import {
  AddTaskArgType,
  RemoveTaskArgType,
  TaskType,
  UpdateTaskArgType,
  UpdateTaskModelType,
} from "features/TodolistsList/api/tasks/tasksApi.types"
import { createAppAsyncThunk } from "common/utils"
import { ResultCode, TaskPriorities, TaskStatuses } from "common/enums"
import { clearTasksAndTodolists } from "common/actions"
import { tasksApi } from "../api/tasks/tasksApi"

const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  "tasks/fetchTasks",
  async (todolistId, thunkAPI) => {
    const res = await tasksApi.getTasks(todolistId)
    const tasks = res.data.items
    return { tasks, todolistId }
  },
)

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>(
  "tasks/addTask",
  async (arg, thunkAPI) => {
    const res = await tasksApi.createTask(arg)
    if (res.data.resultCode === ResultCode.Success) {
      const task = res.data.data.item
      return { task }
    } else {
      return thunkAPI.rejectWithValue(res.data)
    }
  },
)

const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>(
  "tasks/updateTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI
    dispatch(
      tasksActions.changeTaskEntityStatus({
        todolistId: arg.todolistId,
        taskId: arg.taskId,
        entityStatus: "loading",
      }),
    )
    const state = getState()
    const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId)
    if (!task) {
      dispatch(appActions.setAppError({ error: "Task not found in the state" }))
      return rejectWithValue(null)
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...arg.domainModel,
    }

    const res = await tasksApi.updateTask(arg.todolistId, arg.taskId, apiModel)
    dispatch(
      tasksActions.changeTaskEntityStatus({
        todolistId: arg.todolistId,
        taskId: arg.taskId,
        entityStatus: "idle",
      }),
    )
    if (res.data.resultCode === ResultCode.Success) {
      return arg
    } else {
      return rejectWithValue(res.data)
    }
  },
)

const removeTask = createAppAsyncThunk<RemoveTaskArgType, RemoveTaskArgType>(
  "tasks/removeTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI
    dispatch(
      tasksActions.changeTaskEntityStatus({
        todolistId: arg.todolistId,
        taskId: arg.taskId,
        entityStatus: "loading",
      }),
    )
    const res = await tasksApi.deleteTask(arg)
    dispatch(
      tasksActions.changeTaskEntityStatus({
        todolistId: arg.todolistId,
        taskId: arg.taskId,
        entityStatus: "idle",
      }),
    )

    if (res.data.resultCode === ResultCode.Success) {
      return arg
    } else {
      return rejectWithValue(res.data)
    }
  },
)

const initialState: TasksStateType = {}

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    changeTaskEntityStatus: (
      state,
      action: PayloadAction<{
        todolistId: string
        taskId: string
        entityStatus: RequestStatusType
      }>,
    ) => {
      const task = state[action.payload.todolistId].find(
        (task) => task.id === action.payload.taskId,
      )
      if (task) task.entityStatus = action.payload.entityStatus
    },
  },
  selectors: {
    selectTasks: (sliceState) => sliceState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        console.log(current(state[action.payload.todolistId]))

        state[action.payload.todolistId] = action.payload.tasks.map((task) => ({
          ...task,
          entityStatus: "idle",
        }))
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.task.todoListId]
        tasks.unshift({ ...action.payload.task, entityStatus: "idle" })
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((t) => t.id === action.payload.taskId)
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...action.payload.domainModel }
        }
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((t) => t.id === action.payload.taskId)
        if (index !== -1) tasks.splice(index, 1)
      })
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = []
        })
      })
      .addCase(clearTasksAndTodolists, () => {
        return {}
      })
  },
})

export const tasksReducer = slice.reducer
export const tasksThunks = { fetchTasks, addTask, updateTask, removeTask }
export const tasksActions = slice.actions
export const { selectTasks } = slice.selectors

// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}

export type TasksStateType = {
  [key: string]: Array<TaskDomain>
}

export type TaskDomain = TaskType & {
  entityStatus: RequestStatusType
}
