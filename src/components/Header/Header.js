import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import './Header.css';
import { Link, Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Language from '@material-ui/icons/Language';
import messages from '../../translations';
import store from '../../store/store';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLangButton: 'ru',
      lang: 'ru',
      isActiveLangContainer: false,
    };
    this.page = this.props.page;
    this.toggleLangContainer = this.toggleLangContainer.bind(this);
  }

  /* eslint-disable camelcase */
  UNSAFE_componentWillMount() {
    window.addEventListener('beforeunload', () => localStorage.setItem('refreshed', true));
    if (localStorage.getItem('lang')) {
      this.setState({
        lang: localStorage.getItem('lang'),
        activeLangButton: localStorage.getItem('lang'),
      });
    }
  }

  langClickHandler(e, lang, message) {
    localStorage.setItem('lang', lang);
    localStorage.setItem('refreshed', false);
    this.setState({
      lang: e.currentTarget.id,
      activeLangButton: e.currentTarget.id,
    });
    const locales = {
      lang,
      messages: message,
    };
    store.dispatch({ type: 'locales', value: locales });
  }

  /* eslint-disable class-methods-use-this */
  toggleLangContainer() {
    const langNav = document.querySelector('.lang-nav');
    langNav.classList.toggle('show-lang-nav');
    document.body.addEventListener('click', (event) => {
      if (!event.target.parentElement.classList.contains('MuiSvgIcon-root')) {
        langNav.classList.remove('show-lang-nav');
      }
    });
  }

  isRedirected() {
    if (this.state.lang) {
      const page = this.page.split('/');
      page[1] = this.state.lang;
      const redirecTo = page.join('/');
      return <Redirect to={`${redirecTo}`} />;
    }
    return <Redirect to={this.props.page} />;
  }

  render() {
    return (
      <header>
        {this.isRedirected()}
        <div className="header-container">
          <nav className="header-links homepage-links">
            <ul>
              <li>
                <Link
                  to={`/${this.state.lang}`}
                  className="header-link homepage-link"
                  onClick={() => {
                    localStorage.setItem('page', `/${this.state.lang}`);
                    store.dispatch({
                      type: 'page',
                      value: `/${this.state.lang}`,
                    });
                  }}
                >
                  <Button variant="text" color="inherit">
                    <FormattedMessage id="headerMainLink" />
                  </Button>
                </Link>
              </li>
              <li className="lng-icon">
                <Button
                  variant="text"
                  color="inherit"
                  onClick={this.toggleLangContainer}
                >
                  <Language />
                </Button>
              </li>
            </ul>
          </nav>
          <nav className="lang-nav">
            <ul className="lang-list">
              <Button variant="text" color="inherit"
              className={`lang-item ${
                    this.state.activeLangButton === 'ru' ? 'active-lang-button' : ''
                  }`}>
                <li
                  id="ru"
                  className={`lang-item ${
                    this.state.activeLangButton === 'ru' ? 'active-lang' : ''
                  }`}
                  onClick={e => this.langClickHandler(e, 'ru', messages.ru)}
                >
                  Русский
                </li>
              </Button>
              <Button variant="text" color="inherit"
               className={`lang-item ${
                    this.state.activeLangButton === 'be' ? 'active-lang-button' : ''
                  }`}>
                <li
                  id="be"
                  className={`lang-item ${
                    this.state.activeLangButton === 'be' ? 'active-lang' : ''
                  }`}
                  onClick={e => this.langClickHandler(e, 'be', messages.be)}
                >
                  Беларуская
                </li>
              </Button>
              <Button variant="text" color="inherit"
                className={`lang-item ${
                    this.state.activeLangButton === 'en' ? 'active-lang-button' : ''
                  }`}>
                <li
                  id="en"
                  className={`lang-item ${
                    this.state.activeLangButton === 'en' ? 'active-lang' : ''
                  }`}
                  onClick={e => this.langClickHandler(e, 'en', messages.en)}
                >
                  English
                </li>
              </Button>
            </ul>
          </nav>

          <nav className="header-links">
            <ul>
              <li>
                <Link
                  to={`/${this.state.lang}/commonpage`}
                  className="header-link commonpage-link"
                  onClick={() => {
                    localStorage.setItem(
                      'page',
                      `/${this.state.lang}/commonpage`,
                    );
                    store.dispatch({
                      type: 'page',
                      value: `/${this.state.lang}/commonpage`,
                    });
                  }}
                >
                  <Button variant="text" color="inherit">
                    <FormattedMessage id="headerLink" />
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  page: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({ page: state.page });
export default connect(mapStateToProps)(Header);
