import React, { useState } from "react";
import "./App.css";
import Todolist from "./components/Todolist";
import { v1 } from "uuid";

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};
export type TasksType = {};
export type TodolistType = {
  id: string;
  title: string;
  filter: FilterType;
};
export type FilterType = "all" | "active" | "completed";

function App() {
  const id1 = v1();
  const id2 = v1();
  console.log(id1, id2);

  const [todolists, setTodolists] = useState<Array<TodolistType>>([
    { id: id1, title: "Wot to learn ?", filter: "all" },
    { id: id2, title: "Wot to by ?", filter: "completed" },
  ]);
  const [tasks, setTasks] = useState({
    [id1]: [
      { id: v1(), title: "HTML", isDone: true },
      { id: v1(), title: "JS/ES6", isDone: false },
      { id: v1(), title: "REACT", isDone: false },
    ],
    [id2]: [
      { id: v1(), title: "Pyton", isDone: true },
      { id: v1(), title: "JS/ES6", isDone: false },
      { id: v1(), title: "REACT", isDone: false },
    ],
  });

  return (
    <div className="App">
      {todolists.map((todolist) => {
        let tasksForTodolist = tasks[todolist.id];
        if (todolist.filter === "active") {
          tasksForTodolist = tasks[todolist.id].filter(
            (t) => t.isDone === false
          );
        }
        if (todolist.filter === "completed") {
          tasksForTodolist = tasks[todolist.id].filter(
            (t) => t.isDone === true
          );
        }
        if (todolist.filter === "all") {
          tasksForTodolist = tasks[todolist.id];
        }

        const removeCurrentTask = (taskId: string, id: string) => {
          tasks[id] = tasks[id].filter((t) => t.id !== taskId);
          setTasks({ ...tasks });
        };
        const changeFilter = (filter: FilterType, id: string) => {
          const todolist = todolists.find((todolist) => todolist.id === id);
          if (todolist) {
            todolist.filter = filter;
          }

          setTodolists([...todolists]);
        };

        const changeCurrentTaskStatus = (
          taskId: string,
          isDone: boolean,
          id: string
        ) => {
          const task = tasks[id].find((task) => task.id === taskId);
          if (task) {
            task.isDone = isDone;
            setTasks({ ...tasks });
          }
        };

        const addNewTask = (title: string, id: string) => {
          const task: TaskType = { id: v1(), title: title, isDone: false };
          tasks[id].unshift(task);
          setTasks({ ...tasks });
        };
        const changeCurrentTodolistFilter = (
          filter: FilterType,
          id: string
        ) => {
          const todolist = todolists.find((todolist) => todolist.id === id);
          if (todolist) {
            todolist.filter = filter;
            setTodolists([...todolists]);
          }
        };

        return (
          <Todolist
            id={todolist.id}
            tasks={tasksForTodolist}
            title={todolist.title}
            removeCurrentTask={removeCurrentTask}
            addNewTask={addNewTask}
            changeCurrentTaskStatus={changeCurrentTaskStatus}
            changeCurrentTodolistFilter={changeCurrentTodolistFilter}
            filter={todolist.filter}
          />
        );
      })}
    </div>
  );
}

export default App;
