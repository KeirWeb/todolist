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
  removeTodolistAC,
} from "./state/todolists-reducer";
import {
  addNewTaskAC,
  addNewTasksArrayAC,
  changeCurrentTaskStatusAC,
  changeCurrentTaskTitleAC,
  removeCurrentTaskAC,
  removeCurrentTasksArrayAC,
} from "./state/tasks-reducer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AppRootState } from "./state/store";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = {
  id: string;
  title: string;
  filter: FilterValuesType;
};

export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

function AppWithRedux() {
  const dispatch = useDispatch();

  const todolists = useSelector<AppRootState, Array<TodolistType>>(
    (state) => state.todolists
  );

  const tasks = useSelector<AppRootState, TasksStateType>(
    (state) => state.tasks
  );

  function onChangeCurrentTodolistTitle(title: string, id: string) {
    dispatch(changeTodolistTitleAC(title, id));
  }

  function onChangeCurrentTaskTitle(title: string, taskId: string, id: string) {
    dispatch(changeCurrentTaskTitleAC(id, taskId, title));
  }

  function addNewTodolist(title: string) {
    const newId = v1();
    dispatch(addNewTodolistAC(newId, title));
    dispatch(addNewTasksArrayAC(newId));
  }

  function removeTask(taskId: string, todolistId: string) {
    dispatch(removeCurrentTaskAC(todolistId, taskId));
  }

  function addTask(title: string, todolistId: string) {
    dispatch(addNewTaskAC(todolistId, title));
  }

  function changeStatus(id: string, todolistId: string) {
    dispatch(changeCurrentTaskStatusAC(todolistId, id));
  }

  function changeFilter(value: FilterValuesType, todolistId: string) {
    dispatch(changeTodolistFilterAC(todolistId, value));

    // }
  }

  function removeTodolist(id: string) {
    dispatch(removeTodolistAC(id));
    dispatch(removeCurrentTasksArrayAC(id));
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

export default AppWithRedux;
