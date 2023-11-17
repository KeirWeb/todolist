import React, { FC } from "react";
import Button from "./UI/Button";
type TaskProps = {
  isDone: boolean;
  title: string;
  id: string;
  removeCurrentTask: (taskId: string) => void;
  handlerChangeStatus: (taskId: string, isDone: boolean) => void;
  className?: string;
};

const Task: FC<TaskProps> = ({
  isDone,
  title,
  id,
  removeCurrentTask,
  handlerChangeStatus,
  className,
}) => {
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlerChangeStatus(id, e.currentTarget.checked);
  };
  return (
    <>
      <div className={className}>
        <input
          type="checkbox"
          checked={isDone}
          onChange={(e) => onChangeHandler(e)}
        />
        <span>{title}</span>
        <Button callBack={() => removeCurrentTask(id)}>x</Button>
      </div>
    </>
  );
};

export default Task;
