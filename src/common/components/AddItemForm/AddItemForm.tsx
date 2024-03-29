import React, { ChangeEvent, KeyboardEvent, useState } from "react"
import { IconButton, TextField } from "@mui/material"
import { AddBox } from "@mui/icons-material"
import { BaseResponseType } from "common/types"

type Props = {
  addItem: (title: string) => Promise<any>
  disabled?: boolean
}

export const AddItemForm = React.memo(function ({ addItem, disabled = false }: Props) {
  let [title, setTitle] = useState("")
  let [error, setError] = useState<string | null>(null)

  const handleAddItem = () => {
    if (title.trim() !== "") {
      addItem(title)
        .then((res) => {
          setTitle("")
        })
        .catch((err: BaseResponseType) => {
          if (err?.resultCode) {
            setError(err.messages[0])
          }
        })
    } else {
      setError("Title is required")
    }
  }

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null)
    }
    if (e.charCode === 13) {
      handleAddItem()
    }
  }

  return (
    <div>
      <TextField
        variant="outlined"
        disabled={disabled}
        error={!!error}
        value={title}
        onChange={handleChangeTitle}
        onKeyPress={handleKeyPress}
        label="Title"
        helperText={error}
      />
      <IconButton color="primary" onClick={handleAddItem} disabled={disabled}>
        <AddBox />
      </IconButton>
    </div>
  )
})
