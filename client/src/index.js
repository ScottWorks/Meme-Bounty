import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router';

import createBrowserHistory from 'history/createBrowserHistory';

import Bounty from './components/bounty/Bounty';
import BountyBoard from './components/bountyboard/BountyBoard';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <Switch>
      <Route exact path="/" component={BountyBoard} />
      <Route path="/:bountyAddress" component={Bounty} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
