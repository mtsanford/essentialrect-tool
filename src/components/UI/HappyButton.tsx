import React, { useState, MouseEventHandler } from 'react';

const HappyButton: React.FC<{
  token: string;
  isSlave?: boolean; // depressed state managed by parent component
  depressed?: boolean;
  depressedChildren?: React.ReactNode;
  onClick?: (id: string) => void;
}> = ({
  children,
  token,
  isSlave = false,
  depressed: depressedProp,
  depressedChildren,
  onClick,
}) => {
  const [depressedState, setDepressedState] = useState<boolean>(false);

  // If we're a slave, we'll let the parent component manage the depressed state.
  // Otherwise, we'll manage it ourselves
  const depressed = isSlave ? depressedProp : depressedState;

  const depressedClass = depressed
    ? 'happy-button-depressed'
    : 'happy-button-not-depressed';
  const buttonClasses = `happy-button ${depressedClass}`;

  const buttonContent: React.ReactNode =
    depressed && depressedChildren ? depressedChildren : children;

  const mouseDownHandler: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    if (isSlave && onClick) {
      onClick(token);
    }
    if (!isSlave) {
      setDepressedState(true);
    }
  };

  const mouseUpHandler: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    if (!isSlave && depressed) {
      setDepressedState(false);
      if (onClick) {
        onClick(token);
      }
    }
  };

  const mouseLeaveHandler: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    if (!isSlave) {
      setDepressedState(false);
    }
  };

  return (
    <div
      className={buttonClasses}
      onMouseDown={mouseDownHandler}
      onMouseUp={mouseUpHandler}
      onMouseLeave={mouseLeaveHandler}
    >
      <div className="happy-button-content-wrapper">{buttonContent}</div>
    </div>
  );
};

// --------------------------------------------------------------------

interface GroupButtonDescriptor {
  token: string;
  content: React.ReactNode;
  depressedContent?: React.ReactNode;
}

export const HappyButtonGroup: React.FC<{
  buttonDescriptors: GroupButtonDescriptor[];
  selectedToken: string;
  onChange?: (token: string) => void;
}> = ({ buttonDescriptors, selectedToken, onChange }) => {
  const handleClick = (id: string) => {
    if (id !== selectedToken && onChange) {
      onChange(id);
    }
  };

  return (
    <div className="happpy-button-group">
      {buttonDescriptors.map((descriptor) => (
        <HappyButton
          isSlave
          depressedChildren={descriptor.depressedContent}
          token={descriptor.token}
          depressed={selectedToken === descriptor.token}
          onClick={handleClick}
          key={descriptor.token}
        >
          {descriptor.content}
        </HappyButton>
      ))}
    </div>
  );
};

export default HappyButton;
