import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { todolistsThunks } from "features/TodolistsList/model/todolists.slise"
import { selectTasks } from "features/TodolistsList/model/tasks.slise"
import { Grid, Paper } from "@mui/material"
import { AddItemForm } from "common/components"
import { Todolist } from "./Todolist/Todolist"
import { Navigate } from "react-router-dom"
import { selectIsLoggedIn } from "features/auth/model/auth.selectors"
import { selectTodolists } from "features/TodolistsList/model/todolists.selectors"
import { useActions } from "common/hooks/useActions"

export const TodolistsList = () => {
  const todolists = useSelector(selectTodolists)
  const tasks = useSelector(selectTasks)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const { addTodolist: addTodolistThunk, fetchTodolists } = useActions(todolistsThunks)

  useEffect(() => {
    if (!isLoggedIn) {
      return
    }
    fetchTodolists()
  }, [fetchTodolists, isLoggedIn])

  const addTodolistCallback = (title: string) => {
    return addTodolistThunk(title).unwrap()
  }

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolistCallback} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id]

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist todolist={tl} tasks={allTodolistTasks} />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
