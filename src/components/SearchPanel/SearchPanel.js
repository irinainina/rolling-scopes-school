import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import './SearchPanel.css';
import Search from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import store from '../../store/store';

export default class SearchPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: '',
      city: '',
    };
  }


  onTermChange(event) {
    this.setState({
      term: event.target.value,
    });
    store.dispatch({ type: 'term', value: event.target.value });
  }

  onCityChange(event) {
    this.setState({
      city: event.target.value,
    });
    store.dispatch({ type: 'city', value: event.target.value });
  }

  onClickHandler() {
    const term = document.getElementById('termInput').value;
    const city = document.getElementById('cityInput').value;
    this.setState({ term, city });
    store.dispatch({ type: 'term', value: term });
    store.dispatch({ type: 'city', value: city });
  }

  render() {
    return (
      <div className="search-container">
        <form className="search-panel">
          <label>
            <FormattedMessage id="searchName" />
            <input type="text"
              className="search-input"
              placeholder=""
              id="termInput"
              value={this.state.term}
              onChange={e => this.onTermChange(e)} />
          </label>
          <label>
            <FormattedMessage id="searchCity" />
            <input type="text"
              className="search-input"
              placeholder=""
              id="cityInput"
              value={this.state.city}
              onChange={e => this.onCityChange(e)} />
          </label>
          <Button variant="contained" className="btn-search" type="button" onClick={() => this.onClickHandler()}><Search/>
            <FormattedMessage id="searchButton" />
      </Button>
        </form>
      </div>
    );
  }
}
