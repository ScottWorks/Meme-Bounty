import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Routes from './routes';

import { HashRouter } from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <HashRouter>{Routes}</HashRouter>,
  document.getElementById('root')
);

registerServiceWorker();
