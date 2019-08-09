import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import './DatePicker.css';


export default class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  render() {
    return (
      <div className="container">

        <TextField
          className="textField"
          id="date"
          type="date"
          defaultValue={new Date().toISOString().substring(0, 10)}

          InputLabelProps={{
            shrink: true
          }}
          onChange={(event, date) => {
            this.setState({ value: date })
            this.props.onChange(event)
          }
          }
        />
      </div>
    );
  }
}

DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
};