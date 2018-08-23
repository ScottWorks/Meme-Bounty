import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';

import createBrowserHistory from 'history/createBrowserHistory';

import App from './App';

import './reset.css';
import './index.css';

const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('root')
);
