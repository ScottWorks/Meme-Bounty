import React, { Component } from 'react';
import getWeb3 from '../../utils/getWeb3';
import getContractInstance from '../../utils/getContractInstance';

import BountyBoardContract from '../../contracts/BountyBoard.json';
import BountyContract from '../../contracts/Bounty.json';

import './BountyBoard.css';

class BountyBoard extends Component {
  constructor() {
    super();
    this.state = {
      web3: null,
      accounts: null,
      parentContract: null,
      childrenContracts: [],
      bountyTotal: '',
      bountyDescription: '',
      voteDeposit: '',
      challengeDuration: '',
      voteDuration: '',
      bountyAddresses: [],
      bountyArray: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.createBounty = this.createBounty.bind(this);
    this.getBounty = this.getBounty.bind(this);
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();

      const parentContract = await getContractInstance(
        web3,
        BountyBoardContract
      );

      const bountyAddresses = await parentContract.methods
        .getAllBountyAddresses()
        .call({ from: accounts[0] });

      const childrenContracts = await bountyAddresses.map((bountyAddress) => {
        return getContractInstance(web3, BountyContract, bountyAddress);
      });

      console.log(childrenContracts);

      this.setState({
        web3,
        accounts,
        parentContract,
        childrenContracts,
        bountyAddresses
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  handleChange(key, value) {
    this.setState({
      [key]: value
    });
  }

  createBounty = async (event) => {
    event.preventDefault();

    const {
      web3,
      accounts,
      parentContract,
      bountyTotal,
      bountyDescription,
      voteDeposit,
      challengeDuration,
      voteDuration,
      bountyAddresses
    } = this.state;

    const convertedBountyTotal = web3.utils.toWei(bountyTotal, 'ether');
    const convertedVoteDeposit = web3.utils.toWei(voteDeposit, 'ether');
    const convertedchallengeDuration = challengeDuration * 3600;
    const convertedvoteDuration = voteDuration * 3600;

    const newBountyAddress = await parentContract.methods
      .createBountyContract(
        bountyTotal,
        bountyDescription,
        convertedVoteDeposit,
        convertedchallengeDuration,
        convertedvoteDuration
      )
      .send({
        from: accounts[0],
        value: convertedBountyTotal
      });

    let updatedAddresses = bountyAddresses;
    updatedAddresses.push(newBountyAddress.events.LogAddress.returnValues[0]);

    this.setState({
      bountyAddresses: updatedAddresses,
      bountyTotal: '',
      bountyDescription: '',
      voteDeposit: '',
      challengeDuration: '',
      voteDuration: ''
    });
  };

  getBounty = async (bountyAddress) => {};

  render() {
    const {
      bountyTotal,
      bountyDescription,
      voteDeposit,
      challengeDuration,
      voteDuration
    } = this.state;

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="BountyBoard">
        <h1>Bounty Board</h1>

        <h3>Create New Bounty</h3>

        <NewBountyForm
          state={{
            bountyTotal,
            bountyDescription,
            voteDeposit,
            challengeDuration,
            voteDuration
          }}
          handleChange={this.handleChange}
          createBounty={this.createBounty}
        />
      </div>
    );
  }
}

export default BountyBoard;

const NewBountyForm = ({ state, handleChange, createBounty }) => {
  return (
    <form onSubmit={(e) => createBounty(e)}>
      <label htmlFor="Bounty-Total">Bounty Total (ETH): </label>
      <input
        name="Bounty-Total"
        type="number"
        value={state.bountyTotal}
        onChange={(e) => handleChange('bountyTotal', e.target.value)}
      />
      <br />
      <br />

      <label htmlFor="Bounty-Description">Bounty Description: </label>
      <input
        name="Bounty-Description"
        type="text"
        value={state.bountyDescription}
        onChange={(e) => handleChange('bountyDescription', e.target.value)}
      />
      <br />
      <br />

      <label htmlFor="Vote-Deposit">Vote Deposit (ETH): </label>
      <input
        name="Vote-Deposit"
        type="number"
        value={state.voteDeposit}
        onChange={(e) => handleChange('voteDeposit', e.target.value)}
      />
      <br />
      <br />

      <label htmlFor="Challenge-Duration">Challenge Duration (hr): </label>
      <input
        name="Challenge-Duration"
        type="number"
        value={state.challengeDuration}
        onChange={(e) => handleChange('challengeDuration', e.target.value)}
      />
      <br />
      <br />

      <label htmlFor="Vote-Duration">Vote Duration (hr): </label>
      <input
        name="Vote-Duration"
        type="number"
        value={state.voteDuration}
        onChange={(e) => handleChange('voteDuration', e.target.value)}
      />
      <br />
      <br />

      <input type="submit" value="Submit" />
    </form>
  );
};
