import React, { Component } from 'react';
import { Route, HashRouter } from 'react-router-dom';
import Header from './components/Header/Header';
import MainPage from './containers/MainPage/MainPage';
import CommonPage from './containers/CommonPage/CommonPage';
import PersonalPage from './containers/PersonalPage/PersonalPage';
import Footer from './components/Footer/Footer';
import store from './store/store';
import messages from './translations';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      person: 0,
      lang: 'ru',
    };
  }

  componentWillMount() {
    if (localStorage.getItem('lang')) {
      const locales = {
        lang: localStorage.getItem('lang'),
        messages: messages[localStorage.getItem('lang')],
      };
      store.dispatch({ type: 'locales', value: locales });
      this.setState({ lang: localStorage.getItem('lang') });
    }
    if (localStorage.getItem('person')) {
      this.setState({ person: localStorage.getItem('person') });
    }
  }

  componentWillUnmount() {
    this.setState(null);
  }

  onButtonClick = (event) => {
    this.setState({
      person: event.target.id,
    });
    localStorage.setItem('person', event.target.id);
  };

  render() {
    return (
      <HashRouter>
        <div>
          <Header />
          <Route
            path={`/${this.state.lang}`}
            render={() => <MainPage onButtonClick={this.onButtonClick} />}
            exact
          />
          <Route
            path={`/${this.state.lang}/commonpage`}
            render={() => <CommonPage onButtonClick={this.onButtonClick} />}
            exact
          />
          <Route
            path={`/${this.state.lang}/personalpage/person${this.state.person}`}
            render={() => <PersonalPage person={this.state.person} />}
            exact
          />
          <Footer />
        </div>
      </HashRouter>
    );
  }
}

export default App;
