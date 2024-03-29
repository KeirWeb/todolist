import React, { useEffect } from "react"
import { TodolistDomainType } from "features/TodolistsList/model/todolists.slise"
import { AddItemForm } from "common/components"
import { useActions } from "common/hooks/useActions"
import { TaskDomain, tasksThunks } from "features/TodolistsList/model/tasks.slise"
import FilterTasksButton from "./FilterTasksButton/FilterTasksButton"
import Tasks from "./Tasks/Tasks"
import TodolistTitle from "./TodolistTitle/TodolistTitle"

type Props = {
  todolist: TodolistDomainType
  tasks: TaskDomain[]
}

export const Todolist = function ({ todolist, tasks }: Props) {
  const { fetchTasks, addTask } = useActions(tasksThunks)

  useEffect(() => {
    fetchTasks(todolist.id)
  }, [fetchTasks, todolist.id])

  const addTaskCallback = (title: string) => {
    return addTask({ title, todolistId: todolist.id }).unwrap()
  }

  return (
    <div>
      <TodolistTitle todolist={todolist} />

      <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === "loading"} />
      <div>
        <Tasks tasks={tasks} todolist={todolist} />
      </div>
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButton
          filters={["all", "active", "completed"]}
          todolistId={todolist.id}
          filterState={todolist.filter}
        />
      </div>
    </div>
  )
}
