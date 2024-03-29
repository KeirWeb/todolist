import React, { ChangeEvent } from "react"
import { Checkbox, IconButton } from "@mui/material"
import { Delete } from "@mui/icons-material"
import { EditableSpan } from "common/components"
import { TaskStatuses } from "common/enums"
import { TaskDomain, tasksThunks } from "features/TodolistsList/model/tasks.slise"
import { useActions } from "common/hooks/useActions"
import s from "./Task.module.css"

type Props = {
  task: TaskDomain
  todolistId: string
}

export const Task = ({ task, todolistId }: Props) => {
  const { removeTask, updateTask } = useActions(tasksThunks)

  const handelRemoveTask = () => removeTask({ taskId: task.id, todolistId: todolistId })

  const handleChangeStatus = (e: ChangeEvent<HTMLInputElement>) => {
    let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    updateTask({ taskId: task.id, domainModel: { status }, todolistId: todolistId })
  }

  const handelChangeTitle = (title: string) => {
    updateTask({
      taskId: task.id,
      domainModel: { title },
      todolistId: todolistId,
    })
  }

  return (
    <div
      key={task.id}
      className={`${task.entityStatus === "loading" ? s.isDisabled : ""} ${
        task.status === TaskStatuses.Completed ? s.isDone : ""
      }`}
    >
      <Checkbox
        checked={task.status === TaskStatuses.Completed}
        color="primary"
        onChange={handleChangeStatus}
      />

      <EditableSpan value={task.title} onChange={handelChangeTitle} />
      <IconButton onClick={handelRemoveTask}>
        <Delete />
      </IconButton>
    </div>
    // </div>
  )
}
