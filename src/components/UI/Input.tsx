import React, { FC } from "react";

type InputPropsType = {
  type?: string;
  callBack: (inputValue: string) => void;
  value?: string;
  name?: string;
  className?: string;
};

const Input: FC<InputPropsType> = ({
  type,
  callBack,
  value,
  name,
  className,
}) => {
  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    callBack(e.target.value);
  };
  return (
    <>
      <input
        type={type}
        onChange={(e) => onChangeInputValue(e)}
        value={value}
        name={name}
        className={className}
      />
    </>
  );
};

export default Input;
