import React from 'react';
import './Developer.css';
import PropTypes from 'prop-types';

function Developer(props) {
  const gitHubLink = `https://github.com/${props.gitHub}`;

  return (
    <div className="developer-container">
      <img src={props.avatar} alt={props.name} />
      <p className="developer-name">{props.name}</p>
      <p>
        <a href={gitHubLink} target="_blank" rel="noopener noreferrer">
          {props.gitHub}
        </a>
      </p>
    </div>
  );
}

Developer.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  gitHub: PropTypes.string.isRequired,
};

export default Developer;
