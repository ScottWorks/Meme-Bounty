import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import getContractInstance from '../../utils/getContractInstance';
import getWeb3 from '../../utils/getWeb3';

import BountyContract from '../../contracts/Bounty.json';

import ChallengeList from './ChallengeList';

import './Bounty.css';

class Bounty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      account: null,
      bountyAddress: null,
      bountyInstance: null,
      ipfsUrls: []
    };
  }

  componentDidMount = async () => {
    // if (typeof this.props.location.state === 'undefined') {
    //   console.log('fuck');
    //   return null;
    // }

    // const { bountyDetails, web3 } = this.props.location.state;
    // const { bountyDetails } = this.props.location.state;

    // const { web3 } = this.props.web3.payload.web3Instance;

    try {
      let web3 = await this.props.getWeb3();
      web3 = web3.payload.web3Instance;

      const { bountyAddress } = this.props.params;
      console.log(web3, bountyAddress);

      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const bountyInstance = await getContractInstance(
        web3,
        BountyContract,
        bountyAddress
      );

      const challengerAddresses = await bountyInstance.methods
        .getAllChallengerAddresses()
        .call({ from: account });

      challengerAddresses.forEach((challengerAddress) => {
        this.getIpfsUrl(challengerAddress, account, bountyInstance);
      });

      this.setState({
        web3,
        account,
        bountyAddress,
        bountyInstance
      });
    } catch (error) {
      console.log(error);
    }
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
    const { web3, account, bountyAddress, bountyInstance } = this.state;

    await bountyInstance.methods.submitVoteDeposit().send({
      from: account,
      value: web3.utils.toWei(bountyAddress.voterDeposit, 'ether')
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

    await bountyInstance.methods.submitCommit(commit).send({ from: account });
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
      localStorage.setItem(account, JSON.stringify(data));
    } else {
      data = [...data, { challengerAddress, salt }];
      localStorage.setItem(account, JSON.stringify(data));
    }
  };

  revealCommits = async () => {
    const { account, bountyInstance } = this.state;

    let commits = JSON.parse(localStorage.getItem(account));

    if (commits) {
      const commitCount = commits.length;

      for (let i = 0; i < commitCount; i++) {
        let challengerAddress = commits[i].challengerAddress;
        let salt = commits[i].salt;

        await bountyInstance.methods
          .revealCommit(challengerAddress, salt)
          .send({ from: account });
      }

      localStorage.setItem(account, commitCount);
    }
  };

  withdrawFunds = async () => {
    const { account, bountyInstance } = this.state;

    const commitCount = localStorage.getItem(account);

    for (let i = 0; i < commitCount; i++) {
      await bountyInstance.methods.withdrawFunds().send({ from: account });
    }

    localStorage.setItem(account, 0);
  };

  render() {
    const { ipfsUrls } = this.state;

    return (
      <div className="Bounty">
        <h1>Bounty</h1>

        {/* <Link
          to={{
            pathname: `/`
          }}
        >
          Home
        </Link> */}

        <br />

        <input
          type="button"
          value="Reveal UpVotes"
          onClick={this.revealCommits}
        />
        <input
          type="button"
          value="Withdraw Funds"
          onClick={this.withdrawFunds}
        />
        <ChallengeList
          data={{ ipfsUrls }}
          upVoteChallenge={this.upVoteChallenge}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    web3: state.web3
  };
}

export default connect(
  mapStateToProps,
  { getWeb3 }
)(Bounty);
