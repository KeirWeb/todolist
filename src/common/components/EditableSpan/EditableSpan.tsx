import React, { ChangeEvent, useState } from "react"
import { TextField } from "@mui/material"

type Props = {
  value: string
  onChange: (newValue: string) => void
}

export const EditableSpan = React.memo(function ({ value, onChange }: Props) {
  let [editMode, setEditMode] = useState(false)
  let [title, setTitle] = useState(value)

  const handleActivateEditMode = () => {
    setEditMode(true)
    setTitle(value)
  }
  const handleActivateViewMode = () => {
    setEditMode(false)
    onChange(title)
  }
  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  return editMode ? (
    <TextField
      value={title}
      onChange={handleChangeTitle}
      autoFocus
      onBlur={handleActivateViewMode}
    />
  ) : (
    <span onDoubleClick={handleActivateEditMode}>{value}</span>
  )
})
