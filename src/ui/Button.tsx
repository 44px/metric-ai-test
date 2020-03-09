import React from 'react';
import './Button.css';

interface Props {
  onClick: () => any;
}

export const Button: React.FunctionComponent<Props> = ({
  children,
  onClick,
}) => {
  return (
    <button className="Button" type="button" onClick={onClick}>
      {children}
    </button>
  );
};
