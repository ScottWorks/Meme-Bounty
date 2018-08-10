import React, { Component } from 'react';
import getWeb3 from '../../utils/getWeb3';
import getContractInstance from '../../utils/getContractInstance';
import BountyContract from '../../contracts/Bounty.json';

import './Bounty.css';

class Bounty extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();

      const contract = await getContractInstance(web3, BountyContract);

      this.setState({
        web3,
        accounts,
        contract
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call({ from: accounts[0] });

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }

    return (
      <div className="App">
        <h1>Bounty</h1>
      </div>
    );
  }
}

export default Bounty;
