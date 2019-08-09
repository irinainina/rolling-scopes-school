import React from 'react';
import './Description.css';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

function Description(props) {
  let isAlive;
  let lifeYears;
  if (props.data.deathDate === null) {
    isAlive = 'authorAlivespan';
    lifeYears = (
      <>
        <FormattedMessage id={isAlive} />
        <span>{props.data.birthDate}</span>
      </>
    );
  } else {
    isAlive = 'authorLifispan';
    lifeYears = (
      <>
        <FormattedMessage id={isAlive} />
        <span>{props.data.birthDate}</span> -{' '}
        <span>{props.data.deathDate}</span>
      </>
    );
  }

  return (
    <div className="description">
      <h1 className="name">{props.data.name}</h1>
      <p className="occupation">{props.data.occupation}</p>
      <p className="years">{lifeYears}</p>
      <p className="birth-place">
        <FormattedMessage id="birthPlace" />
        <span>{props.data.birthPlace}</span>
      </p>
    </div>
  );
}

Description.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Description;
