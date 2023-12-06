import React, { ChangeEvent } from "react";
import { FilterValuesType } from "./App";
import AddItemForm from "./components/AddItemForm";
import EditableSpan from "./components/EditableSpan";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox";
import { pink } from "@mui/material/colors";

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};

type PropsType = {
  id: string;
  title: string;
  tasks: Array<TaskType>;
  removeTask: (taskId: string, todolistId: string) => void;
  changeFilter: (value: FilterValuesType, todolistId: string) => void;
  addTask: (title: string, todolistId: string) => void;
  changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void;
  removeTodolist: (id: string) => void;
  filter: FilterValuesType;
  onChangeCurrentTodolistTitle: (title: string, id: string) => void;
  onChangeCurrentTaskTitle: (title: string, taskId: string, id: string) => void;
};

export function Todolist(props: PropsType) {
  const addTask = (title: string) => {
    let newTitle = title.trim();
    props.addTask(newTitle, props.id);
  };

  const onChangeTodolistTitle = (title: string) => {
    props.onChangeCurrentTodolistTitle(title, props.id);
  };

  const removeTodolist = () => props.removeTodolist(props.id);

  const onAllClickHandler = () => props.changeFilter("all", props.id);
  const onActiveClickHandler = () => props.changeFilter("active", props.id);
  const onCompletedClickHandler = () =>
    props.changeFilter("completed", props.id);

  return (
    <div>
      <h3>
        <EditableSpan onChangeSpan={onChangeTodolistTitle}>
          {props.title}
        </EditableSpan>
        <IconButton onClick={removeTodolist}>
          <DeleteIcon />
        </IconButton>
      </h3>
      <AddItemForm callback={addTask} />

      <ul style={{ listStyle: "none" }}>
        {props.tasks.map((t) => {
          const onClickHandler = () => props.removeTask(t.id, props.id);
          const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            let newIsDoneValue = e.currentTarget.checked;
            props.changeTaskStatus(t.id, newIsDoneValue, props.id);
          };

          const onChangeTackTitle = (title: string) => {
            props.onChangeCurrentTaskTitle(title, t.id, props.id);
          };

          return (
            <li key={t.id} className={t.isDone ? "is-done" : ""}>
              <Checkbox
                onChange={onChangeHandler}
                checked={t.isDone}
                defaultChecked
                sx={{
                  color: pink[800],
                  "&.Mui-checked": {
                    color: pink[600],
                  },
                }}
              />
              <EditableSpan onChangeSpan={onChangeTackTitle}>
                {t.title}
              </EditableSpan>
              <IconButton onClick={onClickHandler} size="small">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </li>
          );
        })}
      </ul>
      <div>
        <Button
          variant={props.filter === "all" ? "contained" : "text"}
          color="primary"
          onClick={onAllClickHandler}
        >
          All
        </Button>
        <Button
          variant={props.filter === "active" ? "contained" : "text"}
          color="secondary"
          onClick={onActiveClickHandler}
        >
          Active
        </Button>
        <Button
          variant={props.filter === "completed" ? "contained" : "text"}
          color="error"
          onClick={onCompletedClickHandler}
        >
          Completed
        </Button>
      </div>
    </div>
  );
}
