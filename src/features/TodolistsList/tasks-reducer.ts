import {
  AddTodolistActionType,
  RemoveTodolistActionType,
  SetTodolistsActionType,
} from "./todolists-reducer";
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType,
} from "../../api/todolists-api";
import { Dispatch } from "redux";
import { AppRootStateType } from "../../app/store";
import {
  AppActionsType,
  RequestStatusType,
  setErrorAC,
  setStatusAC,
} from "../../app/app-reducer";
import { handleServerNetworkError } from "../../utils/error-utils";
import axios, { AxiosError } from "axios";

const initialState: TasksStateType = {};

export const tasksReducer = (
  state: TasksStateType = initialState,
  action: ActionsType
): TasksStateType => {
  switch (action.type) {
    case "REMOVE-TASK":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].filter(
          (t) => t.id !== action.taskId
        ),
      };
    case "ADD-TASK":
      return {
        ...state,
        [action.task.todoListId]: [
          { ...action.task, entityStatus: "idle" },
          ...state[action.task.todoListId],
        ],
      };
    case "UPDATE-TASK":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((t) =>
          t.id === action.taskId ? { ...t, ...action.model } : t
        ),
      };
    case "ADD-TODOLIST":
      return { ...state, [action.todolist.id]: [] };
    case "REMOVE-TODOLIST":
      const copyState = { ...state };
      delete copyState[action.id];
      return copyState;
    case "SET-TODOLISTS": {
      const copyState = { ...state };
      action.todolists.forEach((tl) => {
        copyState[tl.id] = [];
      });
      return copyState;
    }
    case "SET-TASKS":
      return {
        ...state,
        [action.todolistId]: action.tasks.map((t) => ({
          ...t,
          entityStatus: "idle",
        })),
      };
    case "SET-ENTITY-TASK-STATUS":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((t) =>
          t.id === action.taskId ? { ...t, entityStatus: action.status } : t
        ),
      };
    default:
      return state;
  }
};

// actions
export const removeTaskAC = (taskId: string, todolistId: string) =>
  ({ type: "REMOVE-TASK", taskId, todolistId } as const);

export const addTaskAC = (task: TaskType) =>
  ({ type: "ADD-TASK", task } as const);

export const updateTaskAC = (
  taskId: string,
  model: UpdateDomainTaskModelType,
  todolistId: string
) => ({ type: "UPDATE-TASK", model, todolistId, taskId } as const);

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
  ({ type: "SET-TASKS", tasks, todolistId } as const);

export const setEntityTaskStatusAC = (
  todolistId: string,
  taskId: string,
  status: RequestStatusType
) => {
  return {
    type: "SET-ENTITY-TASK-STATUS",
    todolistId,
    taskId,
    status,
  } as const;
};
// thunks
export const fetchTasksTC =
  (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatusAC("loading"));
    todolistsAPI
      .getTasks(todolistId)
      .then((res) => {
        const tasks = res.data.items;
        const action = setTasksAC(tasks, todolistId);
        dispatch(action);
        dispatch(setStatusAC("succeeded"));
      })
      .catch((e: AxiosError<ErrorType>) => {
        const err = e.response?.data ? e.response.data.messages[0] : e.message;
        handleServerNetworkError(dispatch, err);
      });
  };

export const removeTaskTC =
  (taskId: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setEntityTaskStatusAC(todolistId, taskId, "loading"));
    dispatch(setStatusAC("loading"));
    todolistsAPI
      .deleteTask(todolistId, taskId)
      .then((res) => {
        const action = removeTaskAC(taskId, todolistId);
        dispatch(action);
        dispatch(setStatusAC("succeeded"));
        dispatch(setEntityTaskStatusAC(todolistId, taskId, "idle"));
      })
      .catch((e: AxiosError<ErrorType>) => {
        const err = e.response?.data ? e.response.data.messages[0] : e.message;
        handleServerNetworkError(dispatch, err);
      });
  };

export const addTaskTC =
  (title: string, todolistId: string) =>
  async (dispatch: Dispatch<ActionsType>) => {
    try {
      dispatch(setStatusAC("loading"));
      const res = await todolistsAPI.createTask(todolistId, title);
      const task = res.data.data.item;
      const action = addTaskAC(task);
      dispatch(action);
      dispatch(setStatusAC("succeeded"));
    } catch (e) {
      if (axios.isAxiosError<ErrorType>(e)) {
        const err = e.response?.data ? e.response.data.messages[0] : e.message;
        handleServerNetworkError(dispatch, err);
      } else {
        dispatch(setErrorAC((e as Error).message));
      }
    }
  };

export const updateTaskTC =
  (
    taskId: string,
    domainModel: UpdateDomainTaskModelType,
    todolistId: string
  ) =>
  (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
    const state = getState();
    const task = state.tasks[todolistId].find((t) => t.id === taskId);
    if (!task) {
      //throw new Error("task not found in the state");
      console.warn("task not found in the state");
      return;
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel,
    };
    dispatch(setStatusAC("loading"));
    dispatch(setEntityTaskStatusAC(todolistId, taskId, "loading"));
    todolistsAPI.updateTask(todolistId, taskId, apiModel).then((res) => {
      const action = updateTaskAC(taskId, domainModel, todolistId);
      dispatch(action);
      dispatch(setStatusAC("succeeded"));
      dispatch(setEntityTaskStatusAC(todolistId, taskId, "idle"));
    });
  };

// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};

export type TasksStateType = {
  [key: string]: Array<TaskDomainType>;
};

type ActionsType =
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof updateTaskAC>
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTodolistsActionType
  | ReturnType<typeof setTasksAC>
  | AppActionsType
  | ReturnType<typeof setEntityTaskStatusAC>;

export type ErrorType = {
  statusCode: number;
  messages: string[];
  error: string;
};
export type TaskDomainType = TaskType & {
  entityStatus: RequestStatusType;
};
