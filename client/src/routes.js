import React from 'react';
import { Switch, Route } from 'react-router-dom';

import BountyBoard from './components/bountyboard/BountyBoard';
import Bounty from './components/bounty/Bounty';

export default (
  <Switch>
    <Route exact path="/" component={BountyBoard} />
    <Route path="/bounty/:bountyAddress" component={Bounty} />
  </Switch>
);
