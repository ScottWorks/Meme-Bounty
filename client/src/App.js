import React, { Component } from 'react';
import { Switch, Route } from 'react-router';

import Navbar from './components/common/Navbar';
import Bounty from './components/bounty/Bounty';
import BountyBoard from './components/bountyboard/BountyBoard';

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Navbar />
        <Switch>
          <Route exact path="/" component={BountyBoard} />
          <Route path="/:bountyAddress" component={Bounty} />
        </Switch>
      </div>
    );
  }
}

export default App;
