import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

import getContractInstance from '../../utils/getContractInstance';
import ipfsUpload from '../../utils/ipfs';

import BountyContract from '../../contracts/Bounty.json';

import BountyForm from './BountyForm';
import BountyList from './BountyList';

class BountyBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bountyTotal: '',
      bountyDescription: '',
      voteDeposit: '',
      challengeDuration: '',
      voteDuration: '',
      currentBountyAddress: null,
      isLoading: false
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(key, value) {
    this.setState({
      [key]: value
    });
  }

  createBounty = async (event) => {
    event.preventDefault();

    const { account, bountyBoardInstance, web3 } = this.props.data;
    const {
      bountyTotal,
      bountyDescription,
      voteDeposit,
      challengeDuration,
      voteDuration
    } = this.state;

    const convertedBountyTotal = web3.utils.toWei(bountyTotal, 'ether');
    const convertedVoteDeposit = web3.utils.toWei(voteDeposit, 'ether');
    const convertedchallengeDuration = challengeDuration * 3600;
    const convertedvoteDuration = voteDuration * 3600;

    const result = await bountyBoardInstance.methods
      .createBountyContract(
        convertedBountyTotal,
        bountyDescription,
        convertedVoteDeposit,
        convertedchallengeDuration,
        convertedvoteDuration
      )
      .send({
        from: account,
        value: convertedBountyTotal
      });

    let address = result.events.LogAddress.returnValues[0];
    this.props.getBounty(web3, account, address);

    this.setState({
      bountyTotal: '',
      bountyDescription: '',
      voteDeposit: '',
      challengeDuration: '',
      voteDuration: ''
    });
  };

  uploadFile = async (event, bountyAddress) => {
    event.stopPropagation();
    event.preventDefault();
    event.persist();

    const { account, web3 } = this.props.data;

    await this.setState({ isLoading: true });

    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      const buffer = await Buffer.from(reader.result);

      const ipfsURL = await ipfsUpload(buffer);

      const instance = await getContractInstance(
        web3,
        BountyContract,
        bountyAddress
      );

      await this.setState({ isLoading: false });

      instance.methods.submitChallenge(ipfsURL).send({ from: account });
    };
  };

  freezeBounty = async (event, bountyAddress) => {
    event.preventDefault();
    const { account, web3 } = this.props.data;

    const instance = await getContractInstance(
      web3,
      BountyContract,
      bountyAddress
    );

    instance.methods.toggleEmergencyStop().send({ from: account });
  };

  render() {
    const { bountyDetails } = this.props.data;
    const {
      bountyTotal,
      bountyDescription,
      voteDeposit,
      challengeDuration,
      voteDuration,
      isLoading
    } = this.state;

    if (isLoading) {
      return (
        <div>
          <p>Doing IPFS magic, brb...</p>
        </div>
      );
    }

    return (
      <div className="BountyBoard">
        <h1>Create New Bounty</h1>

        <BountyForm
          data={{
            bountyTotal,
            bountyDescription,
            voteDeposit,
            challengeDuration,
            voteDuration
          }}
          handleChange={this.handleChange}
          createBounty={this.createBounty}
        />

        <BountyList
          data={{ bountyDetails }}
          uploadFile={this.uploadFile}
          freezeBounty={this.freezeBounty}
        />
      </div>
    );
  }
}

export default BountyBoard;
