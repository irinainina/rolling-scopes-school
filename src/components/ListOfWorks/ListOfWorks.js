import React from 'react';
import './ListOfWorks.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

function ListOfWorks(props) {
  return (
    <div id="listOfWorks"
         className="listOfWorks">
      <h2 style={{
        textAlign: 'center', fontSize: '44px', marginTop: 40,
      }}>
        <FormattedMessage id="listWork" />
      </h2>
      <List className="list-works">
        <ListItem button className="listitem-title listitem-container">
          <span className="year">
            <FormattedMessage id="dateCreate" />
            </span>
          <span className="work">
          <FormattedMessage id="workCreate" />
          </span>
        </ListItem>

        {props.data.listOfWorks.map((item, index) => (
          <ListItem button className="listitem-container" key={index}>
            <span className="year">{item.year}</span>
            <span className="work">{item.work}</span>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

ListOfWorks.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ListOfWorks;
