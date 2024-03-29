import React from "react"
import { IconButton } from "@mui/material"
import { EditableSpan } from "common/components"
import { Delete } from "@mui/icons-material"
import { TodolistDomainType, todolistsThunks } from "features/TodolistsList/model/todolists.slise"
import { useActions } from "common/hooks"

type Props = {
  todolist: TodolistDomainType
}
const TodolistTitle = ({ todolist }: Props) => {
  const { title, id, entityStatus } = todolist

  const { removeTodolist, changeTodolistTitle } = useActions(todolistsThunks)

  const handleRemoveTodolist = () => {
    removeTodolist(id)
  }

  const handleChangeTitle = (title: string) => {
    changeTodolistTitle({ id: id, title })
  }
  return (
    <h3>
      <EditableSpan value={title} onChange={handleChangeTitle} />
      <IconButton onClick={handleRemoveTodolist} disabled={entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </h3>
  )
}

export default TodolistTitle
