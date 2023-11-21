import React, { FC } from "react";

type ButtonPropsType = {
  children: string;
  callBack: () => void;
  className?: string;
  disabled?: boolean;
};

const Button: FC<ButtonPropsType> = ({
  children,
  callBack,
  className,
  disabled,
}) => {
  const onClickButtonHandler = () => {
    callBack();
  };
  return (
    <>
      <button
        disabled={disabled}
        className={className}
        onClick={onClickButtonHandler}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
