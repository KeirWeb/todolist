import React from "react";
import { v1 } from "uuid";
import { TasksStateType } from "../App";
import {
  changeCurrentTaskTitleAC,
  addNewTaskAC,
  removeCurrentTaskAC,
  taskReducer,
  ChangeCurrentTaskStatusAC,
} from "./tasks-reduser";

const todolistID1 = v1();
const todolistID2 = v1();
const taskID1 = v1();
const newTitle = "Test Title";

let startState: TasksStateType;

beforeEach(() => {
  startState = {
    [todolistID1]: [
      { id: taskID1, title: "HTML&CSS", isDone: true },
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
});

test("reducer should change current task title", () => {
  const endState = taskReducer(
    startState,
    changeCurrentTaskTitleAC(todolistID1, taskID1, newTitle)
  );
  expect(endState[todolistID1].find((t) => t.id === taskID1)?.title).toBe(
    newTitle
  );
  expect(endState[todolistID1].length).toBe(5);
  expect(endState).not.toBe(startState);
});

test("reducer should remove current task", () => {
  const endState = taskReducer(
    startState,
    removeCurrentTaskAC(todolistID1, taskID1)
  );
  expect(endState[todolistID1].length).toBe(4);
  expect(endState[todolistID1].every((t) => t.id !== taskID1)).toBeTruthy();
  expect(endState).not.toBe(startState);
});

test("reducer should add new task", () => {
  const endState = taskReducer(startState, addNewTaskAC(todolistID1, newTitle));

  expect(endState[todolistID1].length).toBe(6);
  expect(endState[todolistID1][5].title).toBe(newTitle);
  expect(endState).not.toBe(startState);
});

test("reducer should change status current task", () => {
  const endState = taskReducer(
    startState,
    ChangeCurrentTaskStatusAC(todolistID1, taskID1)
  );

  expect(endState[todolistID1].find((t) => t.id === taskID1)?.isDone).not.toBe(
    startState[todolistID1].find((t) => t.id === taskID1)?.isDone
  );
  expect(endState[todolistID1].length).toBe(5);

  expect(endState).not.toBe(startState);
});
