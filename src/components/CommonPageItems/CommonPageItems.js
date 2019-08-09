import React, { Component } from 'react';
import { connect } from 'react-redux';
import './CommonPageItems.css';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { FormattedMessage } from 'react-intl';
import Avatar from '../Avatar/Avatar';
import Description from '../Description/Description';
import ru from '../../data/people';
import en from '../../data/peopleEN';
import be from '../../data/peopleBE';
import store from '../../store/store';

class CommonPageItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: '',
    };
    this.checkMatch = (item, searchWord) => {
      const string = item;
      let array;
      if (string.indexOf('.') !== -1) {
        [, array] = string.split('.');
      } else {
        array = string.split(' ');
      }
      return typeof array === 'string'
        ? array.match(new RegExp(`^${searchWord}`, 'i'))
        : array.some(i => i.match(new RegExp(searchWord, 'i')));
    };
  }

  /* eslint-disable camelcase */
  UNSAFE_componentWillMount() {
    if (this.props.lang === 'ru') {
      this.setState({ items: ru });
    } else if (this.props.lang === 'en') {
      this.setState({ items: en });
    } else if (this.props.lang === 'be') {
      this.setState({ items: be });
    }
  }

  render() {
    return this.state.items.map((item, index) => {
      const term = this.props.term ? this.props.term : '';
      const city = this.props.city ? this.props.city : '';
      return (
        <div
          className={`${
            this.checkMatch(item.name, term)
              && this.checkMatch(item.birthPlace, city)
              ? 'common-page'
              : 'hidden'
          }`}
          key={index}
        >
          <Avatar data={item} />
          <div className="description-container">
            <Description data={item} />
            <Button variant="contained">
            <FormattedMessage id="more">
              {text => <Link
                to={`/${this.props.lang}/personalpage/person${index}`}
                className="read-more-button"
                id={index}
                onClick={(e) => {
                  store.dispatch({ type: 'term', value: '' });
                  store.dispatch({ type: 'city', value: '' });
                  store.dispatch({ type: 'page', value: `/${this.props.lang}/personalpage/person${index}` });
                  localStorage.setItem('page', `/${this.props.lang}/personalpage/person${index}`);
                  this.props.onButtonClick(e);
                }}>
                {text}
              </Link>}
            </FormattedMessage>
            </Button>
          </div>
        </div>
      );
    });
  }
}

CommonPageItems.propTypes = {
  onButtonClick: PropTypes.func.isRequired,
  term: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  lang: PropTypes.string.isRequired,
};


const mapStateToProps = state => ({ term: state.term, city: state.city, lang: state.locales.lang });
export default connect(mapStateToProps)(CommonPageItems);
