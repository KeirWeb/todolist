import React, { FC, useState } from "react";
import TextField from "@mui/material/TextField";

type EditableSpanPropsType = {
  children: string;
  onChangeSpan: (title: string) => void;
};

const EditableSpan: FC<EditableSpanPropsType> = ({
  children,
  onChangeSpan,
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [value, setValue] = useState(children);

  const onChangeInputHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(e.currentTarget.value);
  };
  const onBlurInputHandler = () => {
    onChangeSpan(value);
    setEditMode(false);
  };
  const onDoubleClickSpanHandler = () => {
    setEditMode(true);
    setValue(children);
  };
  return (
    <>
      {editMode ? (
        <TextField
          onBlur={onBlurInputHandler}
          type="text"
          autoFocus
          onChange={(e) => onChangeInputHandler(e)}
          value={value}
          variant="standard"
        />
      ) : (
        <span onDoubleClick={onDoubleClickSpanHandler}>{children}</span>
      )}
    </>
  );
};

export default EditableSpan;
