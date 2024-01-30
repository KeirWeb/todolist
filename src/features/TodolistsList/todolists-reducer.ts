import { todolistsAPI, TodolistType } from "../../api/todolists-api";
import { Dispatch } from "redux";
import {
  AppActionsType,
  RequestStatusType,
  Result_code,
  setStatusAC,
} from "../../app/app-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../utils/error-utils";

const initialState: Array<TodolistDomainType> = [];

export const todolistsReducer = (
  state: Array<TodolistDomainType> = initialState,
  action: ActionsType
): Array<TodolistDomainType> => {
  switch (action.type) {
    case "REMOVE-TODOLIST":
      return state.filter((tl) => tl.id !== action.id);
    case "ADD-TODOLIST":
      return [
        { ...action.todolist, filter: "all", entityStatus: "idle" },
        ...state,
      ];
    case "CHANGE-TODOLIST-TITLE":
      return state.map((tl) =>
        tl.id === action.id ? { ...tl, title: action.title } : tl
      );
    case "CHANGE-TODOLIST-FILTER":
      return state.map((tl) =>
        tl.id === action.id ? { ...tl, filter: action.filter } : tl
      );
    case "SET-TODOLISTS":
      return action.todolists.map((tl) => ({
        ...tl,
        filter: "all",
        entityStatus: "idle",
      }));
    case "SET-ENTITY-STATUS":
      return state.map((todo) =>
        todo.id === action.todolistId
          ? { ...todo, entityStatus: action.entityStatus }
          : todo
      );
    default:
      return state;
  }
};

// actions
export const removeTodolistAC = (id: string) =>
  ({ type: "REMOVE-TODOLIST", id } as const);
export const addTodolistAC = (todolist: TodolistType) =>
  ({ type: "ADD-TODOLIST", todolist } as const);
export const changeTodolistTitleAC = (id: string, title: string) =>
  ({
    type: "CHANGE-TODOLIST-TITLE",
    id,
    title,
  } as const);
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
  ({
    type: "CHANGE-TODOLIST-FILTER",
    id,
    filter,
  } as const);
export const setTodolistsAC = (todolists: Array<TodolistType>) =>
  ({ type: "SET-TODOLISTS", todolists } as const);
export const setEntityStatusAC = (
  todolistId: string,
  entityStatus: RequestStatusType
) => ({ type: "SET-ENTITY-STATUS", todolistId, entityStatus } as const);
// thunks
export const fetchTodolistsTC = () => {
  return (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI
      .getTodolists()
      .then((res) => {
        dispatch(setTodolistsAC(res.data));
        dispatch(setStatusAC("succeeded"));
      })
      .catch((err) => {
        handleServerNetworkError(dispatch, err.message);
      });
  };
};
export const removeTodolistTC = (todolistId: string) => {
  return (dispatch: Dispatch<ActionsType>) => {
    dispatch(setEntityStatusAC(todolistId, "loading"));
    dispatch(setStatusAC("loading"));
    todolistsAPI
      .deleteTodolist(todolistId)
      .then((res) => {
        if (res.data.resultCode === Result_code.SUCCEEDED) {
          dispatch(removeTodolistAC(todolistId));
          dispatch(setStatusAC("succeeded"));
          dispatch(setEntityStatusAC(todolistId, "idle"));
          dispatch(setStatusAC("failed"));
        } else {
          handleServerAppError<{}>(dispatch, res.data);
        }
      })
      .catch((err) => {
        handleServerNetworkError(dispatch, err.message);
      });
  };
};
export const addTodolistTC = (title: string) => {
  return (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatusAC("loading"));
    todolistsAPI
      .createTodolist(title)
      .then((res) => {
        if (res.data.resultCode === Result_code.SUCCEEDED) {
          dispatch(addTodolistAC(res.data.data.item));
          dispatch(setStatusAC("succeeded"));
        } else {
          handleServerAppError<{ item: TodolistType }>(dispatch, res.data);
        }
      })
      .catch((err) => {
        handleServerNetworkError(dispatch, err.message);
      });
  };
};
export const changeTodolistTitleTC = (id: string, title: string) => {
  return (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatusAC("loading"));
    todolistsAPI
      .updateTodolist(id, title)
      .then((res) => {
        if (res.data.resultCode === Result_code.SUCCEEDED) {
          dispatch(changeTodolistTitleAC(id, title));
          dispatch(setStatusAC("succeeded"));
        } else {
          handleServerAppError<{}>(dispatch, res.data);
        }
      })
      .catch((err) => {
        handleServerNetworkError(dispatch, err.message);
      });
  };
};

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | SetTodolistsActionType
  | AppActionsType
  | ReturnType<typeof setEntityStatusAC>;

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
