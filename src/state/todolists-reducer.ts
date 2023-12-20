import { v1 } from "uuid";
import { FilterValuesType, TodolistType } from "../AppWithReducer";

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
  newId: string;
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

export let todolistID1 = v1();
export let todolistID2 = v1();

const initialState: Array<TodolistType> = [
  { id: todolistID1, title: "What to learn", filter: "all" },
  { id: todolistID2, title: "What to buy", filter: "all" },
];

export const todolistsReducer = (
  state: Array<TodolistType> = initialState,
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
      return [
        ...state,
        { id: action.newId, title: action.title, filter: "all" },
      ];
    case "CHANGE-TODOLIST-FILTER":
      return state.map((i) =>
        i.id === action.id ? { ...i, filter: action.newFilter } : i
      );

    default:
      return state;
  }
};

export const removeTodolistAC = (
  todolistId: string
): RemoveTodolistActionType => {
  return { type: "REMOVE-TODOLIST", id: todolistId };
};

export const changeTodolistTitleAC = (
  todolistId: string,
  title: string
): ChangeTodolistTitleActionType => {
  return { type: "CHANGE-TODOLIST-TITLE", id: todolistId, title };
};

export const addNewTodolistAC = (
  newId: string,
  title: string
): AddNewTodolistActionType => {
  return { type: "ADD-NEW-TODOLIST", newId, title };
};

export const changeTodolistFilterAC = (
  todolistId: string,
  newFilter: FilterValuesType
): ChangeTodolistFilterActionType => {
  return { type: "CHANGE-TODOLIST-FILTER", id: todolistId, newFilter };
};
