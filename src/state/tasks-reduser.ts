import { v1 } from "uuid";
import { TasksStateType } from "../App";

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

type ActionsType =
  | ChangeCurrentTaskTitleAC
  | RemoveCurrentTaskAC
  | AddNewTaskAC
  | ChangeCurrentTaskStatusAC;

export const taskReducer = (
  state: TasksStateType,
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

    default:
      throw new Error("I don't understand this action type");
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

export const ChangeCurrentTaskStatusAC = (
  todolistId: string,
  taskId: string
): ChangeCurrentTaskStatusAC => {
  return { type: "CHANGE-CURRENT-TASK-STATUS", todolistId, taskId };
};
