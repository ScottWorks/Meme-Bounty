import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import getWeb3 from '../../utils/getWeb3';
import getContractInstance from '../../utils/getContractInstance';

import BountyContract from '../../contracts/Bounty.json';

import './Bounty.css';

class Bounty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      bountyInstance: null,
      ipfsUrls: []
    };
  }

  async componentDidMount() {
    if (typeof this.props.location.state === 'undefined') {
      console.log('fuck');
      return null;
    }
    const { bountyAddress, web3 } = this.props.location.state;

    const accounts = await web3.eth.getAccounts();
    const bountyInstance = await getContractInstance(
      web3,
      BountyContract,
      bountyAddress
    );

    const challengerAddresses = await bountyInstance.methods
      .getAllChallengerAddresses()
      .call({ from: accounts[0] });

    challengerAddresses.forEach((challengerAddress) => {
      this.getIpfsUrl(challengerAddress, accounts, bountyInstance);
    });

    this.setState({
      web3,
      accounts,
      bountyInstance
    });
  }

  async getIpfsUrl(challengerAddress, accounts, bountyInstance) {
    let ipfsUrl = await bountyInstance.methods
      .getIpfsUrl(challengerAddress)
      .call({ from: accounts[0] });

    this.setState({
      ipfsUrls: [...this.state.ipfsUrls, ipfsUrl]
    });
  }

  render() {
    const { web3 } = this.state;

    return (
      <div className="Bounty">
        <h1>Bounty</h1>
        <Link
          to={{
            pathname: `/`,
            state: { web3: web3 }
          }}
        >
          Home
        </Link>
      </div>
    );
  }
}

export default Bounty;
