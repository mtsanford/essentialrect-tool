import React, { useEffect } from 'react';

const HappyButton: React.FC<{
  token: string;
  depressed: boolean;
  onClick: (id: string) => void;
}> = ({ children, token, depressed, onClick }) => {
  const depressedClass = depressed
    ? 'happy-button-depressed'
    : 'happy-button-not-depressed';
  const buttonClasses = `happy-button ${depressedClass}`;

  const clickHandler = () => onClick(token);

  return (
    <div className={buttonClasses} onClick={clickHandler}>
      <div className="happy-button-content-wrapper">{children}</div>
    </div>
  );
};

export default HappyButton;
