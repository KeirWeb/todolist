import { v1 } from "uuid";
import { TasksStateType } from "../App";
import { todolistID1, todolistID2 } from "./todolists-reducer";

export type ChangeCurrentTaskTitleAC = {
  type: "CHANGE-CURRENT-TASK-TITLE";
  todolistId: string;
  taskId: string;
  newTitle: string;
};

export type RemoveCurrentTaskAC = {
  type: "REMOVE-CURRENT-TASK";
  todolistId: string;
  taskId: string;
};

export type AddNewTaskAC = {
  type: "ADD-NEW-TASK";
  todolistId: string;
  newTitle: string;
};

export type ChangeCurrentTaskStatusAC = {
  type: "CHANGE-CURRENT-TASK-STATUS";
  todolistId: string;
  taskId: string;
};

export type AddNewTasksArrayAC = {
  type: "ADD-NEW-TASKS-ARRAY";
  todolistId: string;
};
export type RemoveCurrentTasksArray = {
  type: "REMOVE-CERRENT-TASKS-ARRAY";
  todolistId: string;
};

type ActionsType =
  | ChangeCurrentTaskTitleAC
  | RemoveCurrentTaskAC
  | AddNewTaskAC
  | ChangeCurrentTaskStatusAC
  | AddNewTasksArrayAC
  | RemoveCurrentTasksArray;

const initialState = {
  [todolistID1]: [
    { id: v1(), title: "HTML&CSS", isDone: true },
    { id: v1(), title: "JS", isDone: true },
    { id: v1(), title: "ReactJS", isDone: false },
    { id: v1(), title: "Rest API", isDone: false },
    { id: v1(), title: "GraphQL", isDone: false },
  ],
  [todolistID2]: [
    { id: v1(), title: "HTML&CSS2", isDone: true },
    { id: v1(), title: "JS2", isDone: true },
    { id: v1(), title: "ReactJS2", isDone: false },
    { id: v1(), title: "Rest API2", isDone: false },
    { id: v1(), title: "GraphQL2", isDone: false },
  ],
};

export const taskReducer = (
  state: TasksStateType = initialState,
  action: ActionsType
): TasksStateType => {
  switch (action.type) {
    case "CHANGE-CURRENT-TASK-TITLE":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((t) =>
          t.id === action.taskId ? { ...t, title: action.newTitle } : t
        ),
      };
    case "REMOVE-CURRENT-TASK":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].filter(
          (t) => t.id !== action.taskId
        ),
      };
    case "ADD-NEW-TASK":
      return {
        ...state,
        [action.todolistId]: [
          ...state[action.todolistId],
          { id: v1(), title: action.newTitle, isDone: false },
        ],
      };
    case "CHANGE-CURRENT-TASK-STATUS":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((t) =>
          t.id === action.taskId ? { ...t, isDone: !t.isDone } : t
        ),
      };
    case "ADD-NEW-TASKS-ARRAY":
      return {
        ...state,
        [action.todolistId]: [],
      };
    case "REMOVE-CERRENT-TASKS-ARRAY":
      const newState = { ...state };
      delete newState[action.todolistId];
      return newState;

    default:
      return state;
  }
};

export const changeCurrentTaskTitleAC = (
  todolistId: string,
  taskId: string,
  newTitle: string
): ChangeCurrentTaskTitleAC => {
  return { type: "CHANGE-CURRENT-TASK-TITLE", todolistId, taskId, newTitle };
};

export const removeCurrentTaskAC = (
  todolistId: string,
  taskId: string
): RemoveCurrentTaskAC => {
  return { type: "REMOVE-CURRENT-TASK", todolistId, taskId };
};

export const addNewTaskAC = (
  todolistId: string,
  newTitle: string
): AddNewTaskAC => {
  return { type: "ADD-NEW-TASK", todolistId, newTitle };
};

export const changeCurrentTaskStatusAC = (
  todolistId: string,
  taskId: string
): ChangeCurrentTaskStatusAC => {
  return { type: "CHANGE-CURRENT-TASK-STATUS", todolistId, taskId };
};

export const addNewTasksArrayAC = (todolistId: string): AddNewTasksArrayAC => {
  return { type: "ADD-NEW-TASKS-ARRAY", todolistId };
};
export const removeCurrentTasksArrayAC = (
  todolistId: string
): RemoveCurrentTasksArray => {
  return { type: "REMOVE-CERRENT-TASKS-ARRAY", todolistId };
};
