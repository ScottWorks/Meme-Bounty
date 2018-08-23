import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { StyleSheet, css } from 'aphrodite';

import formatData from './utils/formatData';
import getContractInstance from './utils/getContractInstance';
import getWeb3 from './utils/getWeb3';

import BountyBoardContract from './contracts/BountyBoard.json';
import BountyContract from './contracts/Bounty.json';

import Navbar from './components/common/Navbar';
import Bounty from './components/bounty/Bounty';
import BountyBoard from './components/bountyboard/BountyBoard';

class App extends Component {
  constructor() {
    super();

    this.state = {
      web3: null,
      account: null,
      bountyBoardInstance: null,
      bountyInstances: [],
      bountyDetails: [],
      isLoading: true
    };
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const bountyBoardInstance = await getContractInstance(
        web3,
        BountyBoardContract
      );

      const bountyAddresses = await bountyBoardInstance.methods
        .getAllBountyAddresses()
        .call({ from: account });

      bountyAddresses.forEach((bountyAddress) => {
        return this.getBounty(web3, account, bountyAddress);
      });

      this.setState({
        web3: web3,
        account: account,
        bountyBoardInstance: bountyBoardInstance
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.log(error);
    }
  };

  getBounty = async (web3, account, bountyAddress) => {
    const instance = await getContractInstance(
      web3,
      BountyContract,
      bountyAddress
    );

    const result = await instance.methods
      .getBountyParameters()
      .call({ from: account });

    let formattedData = await formatData(web3, result);

    this.handleLoading();

    this.setState({
      bountyInstances: [...this.state.bountyInstances, instance],
      bountyDetails: [...this.state.bountyDetails, formattedData]
    });
  };

  handleLoading = () => {
    const { isLoading } = this.state;
    let _isLoading;

    if (isLoading) {
      _isLoading = false;
    }

    this.setState({
      isLoading: _isLoading
    });
  };

  render() {
    const {
      account,
      bountyBoardInstance,
      bountyInstances,
      bountyDetails,
      isLoading,
      web3
    } = this.state;

    if (isLoading) {
      return (
        <div>
          <p>Loading all the goodies...</p>
        </div>
      );
    }

    return (
      <div className={css(styles.app_container)}>
        <Navbar data={{ account, web3 }} />
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => (
              <BountyBoard
                data={{
                  ...props,
                  account,
                  bountyBoardInstance,
                  bountyInstances,
                  bountyDetails,
                  web3
                }}
                getBounty={this.getBounty}
              />
            )}
          />
          <Route
            path="/:bountyAddress"
            render={(props) => (
              <Bounty
                data={{
                  ...props,
                  account,
                  bountyDetails,
                  web3
                }}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  app_container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
});
