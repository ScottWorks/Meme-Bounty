import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import getWeb3 from './utils/getWeb3';
import store from './redux/store';

import Bounty from './components/bounty/Bounty';
import BountyBoard from './components/bountyboard/BountyBoard';

import './index.css';

const history = syncHistoryWithStore(browserHistory, store);

getWeb3
  .then((results) => {
    console.log('Web3 has been initialized...', results);
  })
  .catch((error) => {
    console.log('Web3 has failed to initialize...', error);
  });

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={BountyBoard} />
      <Route path="/bounty/:bountyAddress" component={Bounty} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
