import React, { useCallback } from 'react';
import { Rect, rectEmpty } from '../model/Rect';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  selectConstrain,
  selectLowerConstraintID,
  selectUpperConstraintID,
  uiActions,
} from '../store/ui-slice';
import { selectAspectRatios } from '../store/config-slice';

import HappyButton from './UI/HappyButton';
import maximizeIcon from '../../assets/icons/maximize.svg';
import constrainIcon from '../../assets/icons/crop.svg';
import AspectRatio from '../model/AspectRatio';

const aspectRatioSelectValues = (aspectRatios, predicate) => {
  const aspectRatioSubset = aspectRatios.filter(predicate);
  return [{ id: 'none', text: '---none---' }].concat(
    aspectRatioSubset.map((ar) => ({
      id: ar.id,
      text: `${ar.name} ${ar.ratioText}`,
    }))
  );
};

const aspectRatioFromID = (
  aspectRatios: AspectRatio[],
  id?: string
): number | undefined => {
  return aspectRatios.find((ar) => ar.id === id)?.aspectRatio;
};

const ImageViewerControls = (props: any) => {
  const { onReset } = props;
  const dispatch = useAppDispatch();
  const constrain = useAppSelector(selectConstrain);
  const aspectRatios = useAppSelector(selectAspectRatios);
  let lowerConstraintID = useAppSelector(selectLowerConstraintID);
  let upperConstraintID = useAppSelector(selectUpperConstraintID);

  if (!lowerConstraintID) lowerConstraintID = 'none';
  if (!upperConstraintID) upperConstraintID = 'none';

  const lowerSelectValues = aspectRatioSelectValues(
    aspectRatios,
    (ar) => ar.aspectRatio < 1
  );

  const upperSelectValues = aspectRatioSelectValues(
    aspectRatios,
    (ar) => ar.aspectRatio > 1
  );

  const constrainClicked = useCallback(() => {
    dispatch(uiActions.setConstrain(!constrain));
  }, [constrain, dispatch]);

  const lowerConstraintChanged = (event) => {
    const id = event.target.value === 'none' ? undefined : event.target.value;
    const aspectRatio = aspectRatioFromID(aspectRatios, id);

    event.preventDefault();
    dispatch(uiActions.setLowerConstraint({ id, aspectRatio }));
  };

  const upperConstraintChanged = (event) => {
    const id = event.target.value === 'none' ? undefined : event.target.value;
    const aspectRatio = aspectRatioFromID(aspectRatios, id);

    event.preventDefault();
    dispatch(uiActions.setUpperConstraint({ id, aspectRatio }));
  };

  return (
    <div className="image-viewer-controls">
      <HappyButton onClick={onReset} token="reset">
        <img src={maximizeIcon} alt="" className="svg-button" title="reset" />
      </HappyButton>

      <HappyButton
        onClick={constrainClicked}
        isSlave
        depressed={constrain}
        token="constrain"
      >
        <img
          src={constrainIcon}
          alt=""
          className="svg-toggle-button"
          title="constrain essentialRect"
        />
      </HappyButton>

      <div>
        <label htmlFor="min-aspect-ratio">min target aspect ratio</label>
        <select
          id="min-aspect-ratio"
          value={lowerConstraintID}
          onChange={lowerConstraintChanged}
        >
          {lowerSelectValues.map((ar) => (
            <option value={ar.id} key={ar.id}>
              {ar.text}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="max-aspect-ratio">min target aspect ratio</label>
        <select
          id="max-aspect-ratio"
          value={upperConstraintID}
          onChange={upperConstraintChanged}
        >
          {upperSelectValues.map((ar) => (
            <option value={ar.id} key={ar.id}>
              {ar.text}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ImageViewerControls;
