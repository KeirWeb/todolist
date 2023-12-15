import { v1 } from "uuid";
import { FilterValuesType, TodolistType } from "../App";

export type RemoveTodolistActionType = {
  type: "REMOVE-TODOLIST";
  id: string;
};
export type ChangeTodolistTitleActionType = {
  type: "CHANGE-TODOLIST-TITLE";
  id: string;
  title: string;
};
export type AddNewTodolistActionType = {
  type: "ADD-NEW-TODOLIST";
  title: string;
};
export type ChangeTodolistFilterActionType = {
  type: "CHANGE-TODOLIST-FILTER";
  id: string;
  newFilter: FilterValuesType;
};

type ActionsType =
  | RemoveTodolistActionType
  | ChangeTodolistTitleActionType
  | AddNewTodolistActionType
  | ChangeTodolistFilterActionType;

export const todolistsReducer = (
  state: Array<TodolistType>,
  action: ActionsType
): Array<TodolistType> => {
  switch (action.type) {
    case "REMOVE-TODOLIST":
      return state.filter((i) => i.id !== action.id);
    case "CHANGE-TODOLIST-TITLE":
      return state.map((i) =>
        i.id === action.id ? { ...i, title: action.title } : i
      );

    case "ADD-NEW-TODOLIST":
      return [...state, { id: v1(), title: action.title, filter: "all" }];
    case "CHANGE-TODOLIST-FILTER":
      return state.map((i) =>
        i.id === action.id ? { ...i, filter: action.newFilter } : i
      );

    default:
      throw new Error("I don't understand this action type");
  }
};

export const RemoveTodolistAC = (
  todolistId: string
): RemoveTodolistActionType => {
  return { type: "REMOVE-TODOLIST", id: todolistId };
};

export const ChangeTodolistTitleAC = (
  todolistId: string,
  title: string
): ChangeTodolistTitleActionType => {
  return { type: "CHANGE-TODOLIST-TITLE", id: todolistId, title };
};

export const AddNewTodolistAC = (title: string): AddNewTodolistActionType => {
  return { type: "ADD-NEW-TODOLIST", title };
};

export const ChangeTodolistFilterAC = (
  todolistId: string,
  newFilter: FilterValuesType
): ChangeTodolistFilterActionType => {
  return { type: "CHANGE-TODOLIST-FILTER", id: todolistId, newFilter };
};
