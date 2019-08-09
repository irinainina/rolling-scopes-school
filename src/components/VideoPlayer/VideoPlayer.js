import React from 'react';
import './VideoPlayer.css';
import { FormattedMessage } from 'react-intl';
import { Player } from 'video-react';
import '../../../node_modules/video-react/dist/video-react.css';
import PropTypes from 'prop-types';

function VideoPlayer(props) {
  return (
    <div id="videoPlayer" className="videoPlayer">
      <h2
        style={{
          textAlign: 'center',
          fontSize: '44px',
          marginTop: 40,
        }}
      >
        <FormattedMessage id="video" />
      </h2>
      <Player playsInline poster={props.data.videoSrc} src={props.data.video} />
    </div>
  );
}

VideoPlayer.propTypes = {
  data: PropTypes.object.isRequired,
};

export default VideoPlayer;
