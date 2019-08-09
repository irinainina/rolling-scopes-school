import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import be from 'react-intl/locale-data/be';
import ru from 'react-intl/locale-data/ru';
import App from './App';
import store from './store/store';
import ConnectedIntlProvider from './ConnectedIntlProvider';

addLocaleData([...en, ...be, ...ru]);


ReactDOM.render(
  <Provider store={store}>
    <ConnectedIntlProvider>
      <App />
    </ConnectedIntlProvider>
  </Provider>,
  document.getElementById('root'),
);
