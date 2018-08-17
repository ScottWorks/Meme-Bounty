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
      account: null,
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
    const account = accounts[0];

    const bountyInstance = await getContractInstance(
      web3,
      BountyContract,
      bountyDetails.bountyAddress
    );

    const challengerAddresses = await bountyInstance.methods
      .getAllChallengerAddresses()
      .call({ from: account });

    console.log(challengerAddresses);

    challengerAddresses.forEach((challengerAddress) => {
      this.getIpfsUrl(challengerAddress, account, bountyInstance);
    });

    this.setState({
      web3,
      account,
      bountyDetails,
      bountyInstance
    });
  };

  getIpfsUrl = async (challengerAddress, account, bountyInstance) => {
    let ipfsUrl = await bountyInstance.methods
      .getIpfsUrl(challengerAddress)
      .call({ from: account });

    this.setState({
      ipfsUrls: [...this.state.ipfsUrls, { challengerAddress, ipfsUrl }]
    });
  };

  upVoteChallenge = async (challengerAddress) => {
    const { web3, account, bountyDetails, bountyInstance } = this.state;

    await bountyInstance.methods.submitVoteDeposit().send({
      from: account,
      value: web3.utils.toWei(bountyDetails.voterDeposit, 'ether')
    });

    this.submitCommit(challengerAddress);
  };

  submitCommit = async (challengerAddress) => {
    const { web3, account, bountyInstance } = this.state;

    let salt = this.generateSalt();

    const commit = web3.utils.soliditySha3(
      { type: 'bytes20', value: `${challengerAddress}` },
      { type: 'uint', value: `${salt}` }
    );

    this.storeCommit(challengerAddress, salt);

    await bountyInstance.methods.submitCommit(commit).call({ from: account });
  };

  generateSalt = () => {
    return Math.floor(Math.random() * 10000000 + 1);
  };

  storeCommit = (challengerAddress, salt) => {
    const { account } = this.state;
    let data = [];

    data = JSON.parse(localStorage.getItem(account));

    if (!data) {
      data = [];
      data = [...data, { challengerAddress, salt }];
      console.log(JSON.stringify(data));
      localStorage.setItem(account, JSON.stringify(data));
    } else {
      data = [...data, { challengerAddress, salt }];
      console.log(JSON.stringify(data));
      localStorage.setItem(account, JSON.stringify(data));
    }

    console.log(JSON.parse(localStorage.getItem(account)));
  };

  // revealCommit = () => {};

  getCommit;

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
