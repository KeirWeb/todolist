import React, { FC, useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

type AddItemFormPropsType = {
  callback: (title: string) => void;
};
const AddItemForm: FC<AddItemFormPropsType> = ({ callback }) => {
  let [title, setTitle] = useState("");
  let [error, setError] = useState<string | null>(null);

  const onChangeTitleHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTitle(e.currentTarget.value.trim());
    if (e.currentTarget.value.trim() !== "") {
      setError(null);
    }
  };
  const onKeyPressHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.charCode === 13 && title !== "") {
      callback(title);
      setTitle("");
      setError(null);
    }
    if (title === "") {
      setError("Title is required");
    }
  };
  const onClickHandler = () => {
    if (title !== "") {
      callback(title);
      setTitle("");
      setError(null);
    }
    if (title === "") {
      setError("Title is required");
    }
  };

  return (
    <div>
      <h1>Add new todolist</h1>

      <TextField
        value={title}
        onChange={(e) => onChangeTitleHandler(e)}
        onKeyPress={(e) => onKeyPressHandler(e)}
        label={error ? "Error" : "Title"}
        id="outlined-size-small"
        defaultValue="Small"
        size="small"
        error={!!error}
        helperText={error}
      />
      <IconButton onClick={onClickHandler} size="small" color="primary">
        <AddCircleOutlineIcon />
      </IconButton>
    </div>
  );
};

export default AddItemForm;
