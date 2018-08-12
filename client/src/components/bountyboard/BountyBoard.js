import React, { Component } from 'react';

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
  constructor() {
    super();
    this.state = {
      web3: null,
      accounts: null,
      parentContract: null,
      childContracts: [],
      childrenContractDetails: [],
      bountyTotal: '',
      bountyDescription: '',
      voteDeposit: '',
      challengeDuration: '',
      voteDuration: '',
      buffer: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.createBounty = this.createBounty.bind(this);
    this.getChildInstance = this.getChildInstance.bind(this);
    this.formatBountyData = this.formatBountyData.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
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

      bountyAddresses.forEach((bountyAddress) => {
        return this.getChildInstance(web3, accounts, bountyAddress);
      });

      this.setState({
        web3,
        accounts,
        parentContract
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  getChildInstance = async (web3, accounts, bountyAddress) => {
    const { childContracts, childrenContractDetails } = this.state;

    const instance = await getContractInstance(
      web3,
      BountyContract,
      bountyAddress
    );

    let contractsArray = childContracts;
    contractsArray.push(instance);

    const result = await instance.methods
      .getBountyParameters()
      .call({ from: accounts[0] });

    let formattedData = await this.formatBountyData(result);

    let contractDetailsArray = childrenContractDetails;
    contractDetailsArray.push(formattedData);

    console.log(contractsArray, contractDetailsArray);

    this.setState({
      childContracts: contractsArray,
      childrenContractDetails: contractDetailsArray
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
      contractAddress: inputData[0],
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
      parentContract,
      childContracts,
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

    const result = await parentContract.methods
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
    let childInstance = this.getChildInstance(web3, accounts, address);

    this.setState({
      childContracts: childContracts.push(childInstance),
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
    };
  };

  render() {
    const {
      web3,
      childrenContractDetails,
      bountyTotal,
      bountyDescription,
      voteDeposit,
      challengeDuration,
      voteDuration
    } = this.state;

    if (!web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
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
          state={{ childrenContractDetails }}
          uploadFile={this.uploadFile}
        />
      </div>
    );
  }
}

export default BountyBoard;
