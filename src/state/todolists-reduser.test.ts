import React from "react";
import { v1 } from "uuid";
import { TodolistType } from "../App";
import {
  RemoveTodolistAC,
  ChangeTodolistTitleAC,
  AddNewTodolistAC,
  ChangeTodolistFilterAC,
  todolistsReducer,
} from "./todolists-reduser";

let todolistID1 = v1();
let todolistID2 = v1();

let startState: Array<TodolistType>;

beforeEach(() => {
  startState = [
    { id: todolistID1, title: "What to learn", filter: "all" },
    { id: todolistID2, title: "What to buy", filter: "all" },
  ];
});

test("reducer should remove current todolist", () => {
  const endState = todolistsReducer(startState, RemoveTodolistAC(todolistID1));

  expect(endState.length).toBe(1);
  expect(endState[0].id).not.toBe(todolistID1);
  expect(endState).not.toBe(startState);
});

test("reducer should change todolist title", () => {
  const newTitle = "Test title";

  const endState = todolistsReducer(
    startState,
    ChangeTodolistTitleAC(todolistID1, newTitle)
  );

  expect(endState[0].title).toBe(newTitle);
  expect(endState.length).toBe(2);
  expect(endState).not.toBe(startState);
});

test("reducer should add new todolist", () => {
  const title = "Test title";

  const endState = todolistsReducer(startState, AddNewTodolistAC(title));

  expect(endState.length).toBe(3);
  expect(endState[2].title).toBe(title);
  expect(endState).not.toBe(startState);
});

test("reducer should change todolist filter", () => {
  const newFilter = "active";

  const endState = todolistsReducer(
    startState,
    ChangeTodolistFilterAC(todolistID1, newFilter)
  );

  expect(endState[0].filter).toBe(newFilter);
  expect(endState.length).toBe(2);
  expect(endState).not.toBe(startState);
});
