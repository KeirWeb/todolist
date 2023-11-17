import React, { FC, useState } from "react";
import Button from "./UI/Button";
import { FilterType, TaskType } from "../App";
import Task from "./Task";
import Input from "./UI/Input";

type TodolistPropsType = {
  filter: FilterType;
  tasks: Array<TaskType>;
  title: string;
  removeCurrentTask: (taskId: string, id: string) => void;
  addNewTask: (inputValue: string, id: string) => void;
  changeCurrentTaskStatus: (
    taskId: string,
    isDone: boolean,
    id: string
  ) => void;
  id: string;
  changeCurrentTodolistFilter: (filter: FilterType, id: string) => void;
};

const Todolist: FC<TodolistPropsType> = ({
  tasks,
  title,
  removeCurrentTask,
  addNewTask,
  changeCurrentTaskStatus,
  id,
  changeCurrentTodolistFilter,
  filter,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string>("");
  const changeTaskStatus = (taskId: string, isDone: boolean) => {
    changeCurrentTaskStatus(taskId, isDone, id);
  };

  const addNewTaskAndClearState = () => {
    if (inputValue.trim() === "") {
      setError("Field is required!");
      return;
    }
    addNewTask(inputValue, id);
    setInputValue("");
  };

  const onChangeInputValue = (value: string) => {
    setInputValue(value);
    setError("");
  };

  const changeFilterToAll = () => {
    changeCurrentTodolistFilter("all", id);
  };
  const changeFilterToActive = () => {
    changeCurrentTodolistFilter("active", id);
  };
  const changeFilterToCompleted = () => {
    changeCurrentTodolistFilter("completed", id);
  };

  const removeTask = (taskId: string) => {
    removeCurrentTask(taskId, id);
  };

  return (
    <div>
      <h3>{title}</h3>
      <div>
        <Input
          callBack={onChangeInputValue}
          value={inputValue}
          className={error ? "error" : ""}
        />
        <Button callBack={addNewTaskAndClearState}>+</Button>
      </div>
      {error && <span className="error-message">{error}</span>}
      <ul>
        {tasks.map((item) => (
          <Task
            className={item.isDone ? "is-done" : ""}
            {...item}
            removeCurrentTask={removeTask}
            key={item.id}
            handlerChangeStatus={changeTaskStatus}
          />
        ))}
      </ul>
      <div>
        <Button
          className={filter === "all" ? "all-filter" : ""}
          callBack={changeFilterToAll}
        >
          All
        </Button>
        <Button
          className={filter === "active" ? "active-filter" : ""}
          callBack={changeFilterToActive}
        >
          Active
        </Button>
        <Button
          className={filter === "completed" ? "completed-filter" : ""}
          callBack={changeFilterToCompleted}
        >
          Completed
        </Button>
      </div>
    </div>
  );
};

export default Todolist;
