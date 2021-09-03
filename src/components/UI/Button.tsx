import React, { useEffect } from 'react';

const Controls: React.FC = () => {
  const clickHandler = (event) => {};

  return (
    <div className="button">
      <Grid />
      {// eslint-disable-next-line jsx-a11y/click-events-have-key-events}
      <div className="aspect=ratio" onClick={clickHandler}>
        HD (16:9)
      </div>
    </div>
  );
};

export default Controls;
