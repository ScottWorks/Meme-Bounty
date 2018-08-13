import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import getContractInstance from '../../utils/getContractInstance';
import getWeb3 from '../../utils/getWeb3';
import { ipfsUpload } from '../../utils/ipfs';
import timeConversion from '../../utils/timeConversion';

import BountyBoardContract from '../../contracts/BountyBoard.json';
import BountyContract from '../../contracts/Bounty.json';

import BountyForm from './BountyForm';
import BountyList from './BountyList';

import './BountyBoard.css';

class BountyBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      bountyBoardInstance: null,
      bountyInstances: [],
      bountyDetails: [],
      bountyTotal: '',
      bountyDescription: '',
      voteDeposit: '',
      challengeDuration: '',
      voteDuration: '',
      currentBountyAddress: null,
      redirect: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.createBounty = this.createBounty.bind(this);
    this.getBounty = this.getBounty.bind(this);
    this.formatBountyData = this.formatBountyData.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.redirectToBounty = this.redirectToBounty.bind(this);
  }

  async componentDidMount() {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const bountyBoardInstance = await getContractInstance(
        web3,
        BountyBoardContract
      );

      const bountyAddresses = await bountyBoardInstance.methods
        .getAllBountyAddresses()
        .call({ from: accounts[0] });

      bountyAddresses.forEach((bountyAddress) => {
        return this.getBounty(web3, accounts, bountyAddress);
      });

      this.setState({
        web3,
        accounts,
        bountyBoardInstance
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  }

  getBounty = async (web3, accounts, bountyAddress) => {
    // const { bountyInstances, bountyDetails } = this.state;

    const instance = await getContractInstance(
      web3,
      BountyContract,
      bountyAddress
    );

    // let contractsArray = bountyInstances;
    // contractsArray.push(instance);

    const result = await instance.methods
      .getBountyParameters()
      .call({ from: accounts[0] });

    let formattedData = await this.formatBountyData(result);

    // let bountyDetailsArray = bountyDetails;
    // bountyDetailsArray.push(formattedData);

    // console.log(contractsArray, bountyDetailsArray);

    this.setState({
      bountyInstances: [...this.state.bountyInstances, instance],
      bountyDetails: [...this.state.bountyDetails, formattedData]
    });
  };

  formatBountyData(inputData) {
    const { web3 } = this.state;

    let status;

    let creationDate = timeConversion.fromEpoch(inputData[3], 'MM-DD-YYYY');

    switch (inputData[5]) {
      case '0':
        status = 'Challenge';
        break;
      case '1':
        status = 'Commit';
        break;
      case '2':
        status = 'Reveal';
        break;
      case '3':
        status = 'Withdraw';
        break;
      case '4':
        status = 'Inactive';
        break;
      default:
        status = 'Error';
        break;
    }

    const data = {
      bountyAddress: inputData[0],
      owner: inputData[1],
      posterDeposit: web3.utils.fromWei(inputData[2], 'ether'),
      creationTimestamp: inputData[3],
      creationDate: creationDate,
      description: inputData[4],
      status: status,
      voterDeposit: web3.utils.fromWei(inputData[6], 'ether'),
      challengeDuration: inputData[7],
      voteDuration: inputData[8],
      totalVoterCount: inputData[9],
      winningVoterCount: inputData[10],
      voterDepositTotal: web3.utils.fromWei(inputData[11], 'ether'),
      voterPayout: web3.utils.fromWei(inputData[12], 'ether')
    };

    return data;
  }

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
      bountyBoardInstance,
      // bountyInstances,
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
        from: accounts[0],
        value: convertedBountyTotal
      });

    console.log(result);

    let address = result.events.LogAddress.returnValues[0];
    let bountyInstance = this.getBounty(web3, accounts, address);

    this.setState({
      bountyInstances: [...this.state.bountyInstances, bountyInstance],
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

    const { web3, accounts } = this.state;

    const file = event.target.files[0];
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = async () => {
      const buffer = await Buffer.from(reader.result);

      const ipfsHash = await ipfsUpload(buffer);

      const instance = await getContractInstance(
        web3,
        BountyContract,
        bountyAddress
      );

      console.log(ipfsHash);
      instance.methods.submitChallenge(ipfsHash).send({ from: accounts[0] });

      this.redirectToBounty(bountyAddress);
    };
  };

  redirectToBounty(bountyAddress) {
    this.setState({
      currentBountyAddress: bountyAddress,
      redirect: true
    });
  }

  render() {
    const {
      web3,
      bountyDetails,
      bountyTotal,
      bountyDescription,
      voteDeposit,
      challengeDuration,
      voteDuration,
      currentBountyAddress,
      redirect
    } = this.state;

    // if (!web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }

    if (redirect) {
      return (
        <Redirect
          to={{
            pathname: `/bounty/${currentBountyAddress}`,
            state: { web3: web3, bountyAddress: currentBountyAddress }
          }}
        />
      );
    }

    return (
      <div className="BountyBoard">
        <h1>Create New Bounty</h1>

        <BountyForm
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

        <BountyList
          state={{ bountyDetails }}
          uploadFile={this.uploadFile}
          redirectToBounty={this.redirectToBounty}
        />
      </div>
    );
  }
}

export default BountyBoard;
