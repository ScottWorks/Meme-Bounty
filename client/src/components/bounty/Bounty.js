import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

import formatData from '../../utils/formatData';
import getContractInstance from '../../utils/getContractInstance';

import BountyContract from '../../contracts/Bounty.json';

import ChallengeList from './ChallengeList';

class Bounty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bountyInstance: null,
      bountyDetails: null,
      ipfsUrls: []
    };
  }

  componentDidMount = async () => {
    try {
      const { bountyAddress } = this.props.data.match.params;
      const { account, web3 } = this.props.data;

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

      const result = await bountyInstance.methods
        .getBountyParameters()
        .call({ from: account });

      let bountyDetails = await formatData(web3, result);

      this.setState({
        web3,
        account,
        bountyInstance,
        bountyDetails
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
    const { account, web3 } = this.props.data;
    const { bountyDetails, bountyInstance } = this.state;

    await bountyInstance.methods.submitVoteDeposit().send({
      from: account,
      value: web3.utils.toWei(bountyDetails.voterDeposit, 'ether')
    });

    this.submitCommit(challengerAddress);
  };

  submitCommit = async (challengerAddress) => {
    const { account, web3 } = this.props.data;
    const { bountyInstance } = this.state;

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
    const { account } = this.props.data;
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
    const { account } = this.props.data;
    const { bountyInstance } = this.state;

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
    const { account } = this.props.data;
    const { bountyDetails, bountyInstance } = this.state;

    console.log(account, bountyDetails.bountyWinner);

    if (account == bountyDetails.bountyWinner) {
      await bountyInstance.methods.withdrawFunds().send({ from: account });
    } else {
      const commitCount = localStorage.getItem(account);

      for (let i = 0; i < commitCount; i++) {
        await bountyInstance.methods.withdrawFunds().send({ from: account });
      }

      localStorage.setItem(account, 0);
    }
  };

  render() {
    const { bountyDetails, ipfsUrls } = this.state;

    let revealButton, withdrawButton, status;

    if (bountyDetails) {
      status = bountyDetails.status;

      revealButton =
        status === 'Reveal' ? (
          <input
            className={css(styles.button)}
            type="button"
            value="Reveal UpVotes"
            onClick={this.revealCommits}
          />
        ) : (
          <input
            className={css(styles.button)}
            type="button"
            value="Reveal UpVotes"
            onClick={this.revealCommits}
            disabled
          />
        );

      withdrawButton =
        status === 'Withdraw' ? (
          <input
            className={css(styles.button)}
            type="button"
            value="Withdraw Funds"
            onClick={this.withdrawFunds}
          />
        ) : (
          <input
            className={css(styles.button)}
            type="button"
            value="Withdraw Funds"
            onClick={this.withdrawFunds}
            disabled
          />
        );
    }

    return (
      <div className={css(styles.bounty_container)}>
        <div className={css(styles.bountyTitle_header)}>
          <p>Challenges</p>
        </div>
        <div className={css(styles.header_container)}>
          <button
            className={css(styles.button)}
            onClick={() => window.location.assign(`/`)}
          >
            Go Back
          </button>

          {revealButton}

          {withdrawButton}
        </div>

        <ChallengeList
          data={{ ipfsUrls, status }}
          upVoteChallenge={this.upVoteChallenge}
        />
      </div>
    );
  }
}

export default Bounty;

const styles = StyleSheet.create({
  bounty_container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '750px'
  },
  bountyTitle_header: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '25px',
    fontSize: '2.5rem',
    fontWeight: '800'
  },
  header_container: {
    display: 'flex',
    justifyContent: 'center'
  },
  challenges_container: {
    display: 'flex',
    justifyContent: 'center'
  },
  button: {
    margin: '24px',
    border: '2.5px solid gray',
    backgroundColor: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '1rem',
    small: {
      width: '100px'
    },
    large: {
      width: '200px'
    },
    ':enabled': {
      cursor: 'pointer',
      ':hover': {
        color: 'white',
        backgroundColor: 'grey'
      }
    },
    ':disabled': {
      backgroundColor: 'white'
    }
  }
});
