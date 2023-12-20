import React, { useReducer, useState } from "react";
import "./App.css";
import { TaskType, Todolist } from "./Todolist";
import { v1 } from "uuid";
import AddItemForm from "./components/AddItemForm";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import { Grid } from "@mui/material";
import Paper from "@mui/material/Paper";
import {
  changeTodolistTitleAC,
  addNewTodolistAC,
  changeTodolistFilterAC,
  todolistsReducer,
  removeTodolistAC,
} from "./state/todolists-reducer";
import {
  addNewTaskAC,
  addNewTasksArrayAC,
  changeCurrentTaskStatusAC,
  changeCurrentTaskTitleAC,
  removeCurrentTaskAC,
  removeCurrentTasksArrayAC,
  taskReducer,
} from "./state/tasks-reducer";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = {
  id: string;
  title: string;
  filter: FilterValuesType;
};

export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

function AppWithReducer() {
  let todolistID1 = v1();
  let todolistID2 = v1();

  let [todolists, dispatchToTodolistReducer] = useReducer(todolistsReducer, [
    { id: todolistID1, title: "What to learn", filter: "all" },
    { id: todolistID2, title: "What to buy", filter: "all" },
  ]);

  let [tasks, dispatchToTasksReducer] = useReducer(taskReducer, {
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
  });

  function onChangeCurrentTodolistTitle(title: string, id: string) {
    dispatchToTodolistReducer(changeTodolistTitleAC(title, id));
    // const todolist = todolists.find((t) => t.id === id);
    // if (todolist) {
    //   todolist.title = title;
    //   setTodolists([...todolists]);
    // }
  }

  function onChangeCurrentTaskTitle(title: string, taskId: string, id: string) {
    dispatchToTasksReducer(changeCurrentTaskTitleAC(id, taskId, title));
    // const task = tasks[id].find((t) => t.id === taskId);
    // if (task) {
    //   task.title = title;
    //   setTasks({ ...tasks });
    // }
  }

  function addNewTodolist(title: string) {
    const newId = v1();
    dispatchToTodolistReducer(addNewTodolistAC(newId, title));
    dispatchToTasksReducer(addNewTasksArrayAC(newId));
    // const newTodolist: TodolistType = {
    //   id: newId,
    //   title: title,
    //   filter: "all",
    // };
    // const newTasks: TasksStateType = {
    //   [newId]: [],
    // };
    // setTodolists([...todolists, newTodolist]);
    // setTasks({ ...newTasks, ...tasks });
  }

  function removeTask(taskId: string, todolistId: string) {
    dispatchToTasksReducer(removeCurrentTaskAC(todolistId, taskId));
    // let todolistTasks = tasks[todolistId];
    // tasks[todolistId] = todolistTasks.filter((t) => t.id != id);
    // setTasks({ ...tasks });
  }

  function addTask(title: string, todolistId: string) {
    dispatchToTasksReducer(addNewTaskAC(todolistId, title));
    // let task = { id: v1(), title: title, isDone: false };
    // let todolistTasks = tasks[todolistId];
    // tasks[todolistId] = [task, ...todolistTasks];
    // setTasks({ ...tasks });
  }

  function changeStatus(id: string, todolistId: string) {
    dispatchToTasksReducer(changeCurrentTaskStatusAC(todolistId, id));
    // let todolistTasks = tasks[todolistId];
    // let task = todolistTasks.find((t) => t.id === id);
    // if (task) {
    //   task.isDone = isDone;
    //   setTasks({ ...tasks });
    // }
  }

  function changeFilter(value: FilterValuesType, todolistId: string) {
    dispatchToTodolistReducer(changeTodolistFilterAC(todolistId, value));
    // let todolist = todolists.find((tl) => tl.id === todolistId);
    // if (todolist) {
    //   todolist.filter = value;
    //   setTodolists([...todolists]);
    // }
  }

  function removeTodolist(id: string) {
    dispatchToTodolistReducer(removeTodolistAC(id));
    dispatchToTasksReducer(removeCurrentTasksArrayAC(id));
    // setTodolists(todolists.filter((tl) => tl.id != id));
    // delete tasks[id];
    // setTasks({ ...tasks });
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <Grid container style={{ marginBottom: "20px" }}>
          <AddItemForm callback={addNewTodolist} />
        </Grid>
        <Grid container spacing={3}>
          {todolists.map((tl) => {
            let allTodolistTasks = tasks[tl.id];
            let tasksForTodolist = allTodolistTasks;

            if (tl.filter === "active") {
              tasksForTodolist = allTodolistTasks.filter(
                (t) => t.isDone === false
              );
            }
            if (tl.filter === "completed") {
              tasksForTodolist = allTodolistTasks.filter(
                (t) => t.isDone === true
              );
            }

            return (
              <Grid item>
                <Paper style={{ padding: "5px 20px" }}>
                  <Todolist
                    key={tl.id}
                    id={tl.id}
                    title={tl.title}
                    tasks={tasksForTodolist}
                    removeTask={removeTask}
                    changeFilter={changeFilter}
                    addTask={addTask}
                    changeTaskStatus={changeStatus}
                    filter={tl.filter}
                    removeTodolist={removeTodolist}
                    onChangeCurrentTodolistTitle={onChangeCurrentTodolistTitle}
                    onChangeCurrentTaskTitle={onChangeCurrentTaskTitle}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}

export default AppWithReducer;
