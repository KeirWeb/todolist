import React, { FC } from "react";

type ButtonPropsType = {
  children: string;
  callBack: () => void;
  className?: string;
};

const Button: FC<ButtonPropsType> = ({ children, callBack, className }) => {
  const onClickButtonHandler = () => {
    callBack();
  };
  return (
    <>
      <button className={className} onClick={onClickButtonHandler}>
        {children}
      </button>
    </>
  );
};

export default Button;
