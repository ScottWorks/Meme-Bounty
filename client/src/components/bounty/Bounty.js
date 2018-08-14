import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import getContractInstance from '../../utils/getContractInstance';

import BountyContract from '../../contracts/Bounty.json';

import ChallengeList from './ChallengeList';

import './Bounty.css';

class Bounty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      bountyDetails: null,
      bountyInstance: null,
      ipfsUrls: []
    };
  }

  componentDidMount = async () => {
    if (typeof this.props.location.state === 'undefined') {
      console.log('fuck');
      return null;
    }

    console.log(this.props);

    const { bountyDetails, web3 } = this.props.location.state;

    const accounts = await web3.eth.getAccounts();
    const bountyInstance = await getContractInstance(
      web3,
      BountyContract,
      bountyDetails.bountyAddress
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
      bountyDetails,
      bountyInstance
    });
  };

  getIpfsUrl = async (challengerAddress, accounts, bountyInstance) => {
    let ipfsUrl = await bountyInstance.methods
      .getIpfsUrl(challengerAddress)
      .call({ from: accounts[0] });

    this.setState({
      ipfsUrls: [...this.state.ipfsUrls, { challengerAddress, ipfsUrl }]
    });
  };

  upVoteChallenge = async (challengerAddress) => {
    const { web3, accounts, bountyDetails, bountyInstance } = this.state;

    await bountyInstance.methods.submitVoteDeposit().send({
      from: accounts[0],
      value: web3.utils.toWei(bountyDetails.voterDeposit, 'ether')
    });

    this.submitCommit(challengerAddress);
  };

  submitCommit = async (challengerAddress) => {
    const { web3, accounts, bountyInstance } = this.state;

    let salt = this.generateSalt();

    console.log(challengerAddress, salt);

    const commit = web3.utils.soliditySha3(
      { type: 'bytes20', value: `${challengerAddress}` },
      { type: 'uint', value: `${salt}` }
    );

    await bountyInstance.methods
      .submitCommit(commit)
      .call({ from: accounts[0] });

    this.storeCommit(challengerAddress, salt);
  };

  generateSalt = () => {
    return Math.floor(Math.random() * 100000 + 1);
  };

  storeCommit = (challengerAddress, salt) => {
    localStorage.setItem(challengerAddress, salt);

    alert(localStorage.getItem(challengerAddress));
  };

  render() {
    const { ipfsUrls } = this.state;

    return (
      <div className="Bounty">
        <h1>Bounty</h1>

        <Link
          to={{
            pathname: `/`
          }}
        >
          Home
        </Link>

        <ChallengeList
          data={{ ipfsUrls }}
          upVoteChallenge={this.upVoteChallenge}
        />
      </div>
    );
  }
}

export default Bounty;
