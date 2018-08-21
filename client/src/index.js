import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

// import getWeb3 from './utils/getWeb3';
import store from './redux/store';

import Bounty from './components/bounty/Bounty';
import BountyBoard from './components/bountyboard/BountyBoard';

import './index.css';
import getWeb3 from './utils/getWeb3';

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={BountyBoard} />
      <Route path="/:bountyAddress" component={Bounty} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
