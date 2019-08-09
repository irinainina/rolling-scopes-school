import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Timeline, TimelineItem } from 'vertical-timeline-component-for-react';
import PropTypes from 'prop-types';

function TimeLine(props) {
  return (
    <div id="timeline"
         className="timeline-container">
      <h2 style={{
        textAlign: 'center', fontSize: '44px', marginTop: 40,
      }}>
        <FormattedMessage id="biography" />
      </h2>
      <Timeline lineColor={'#ddd'}>
        {props.data.activity.map((item, index) => (
          <TimelineItem
            key={index}
            dateText={item.date}
            dateInnerStyle={{ background: '#e86971', color: '#fff' }}
          >
            <h3>{item.place}</h3>
            <p>{item.description}</p>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}

TimeLine.propTypes = {
  data: PropTypes.object.isRequired,
};

export default TimeLine;
