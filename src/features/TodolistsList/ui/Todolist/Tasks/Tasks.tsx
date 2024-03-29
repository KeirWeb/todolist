import React from "react"
import { Task } from "../Task/Task"
import { TodolistDomainType } from "features/TodolistsList/model/todolists.slise"
import { TaskStatuses } from "common/enums"
import { TaskDomain } from "features/TodolistsList/model/tasks.slise"

type Props = {
  tasks: TaskDomain[]
  todolist: TodolistDomainType
}
const Tasks = ({ tasks, todolist }: Props) => {
  const { id, filter } = todolist
  let tasksForTodolist = tasks

  if (filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed)
  }

  return (
    <>
      {tasksForTodolist.map((t) => (
        <Task key={t.id} task={t} todolistId={id} />
      ))}
    </>
  )
}

export default Tasks
