import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

import getContractInstance from '../../utils/getContractInstance';
import ipfsUpload from '../../utils/ipfs';

import BountyContract from '../../contracts/Bounty.json';

import BountyForm from './BountyForm';
import BountyList from './BountyList';
import Modal from '../common/Modal';

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
      isLoading: false,
      showModal: false
    };
  }

  handleChange = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  handleToggleModal = () => {
    const { showModal } = this.state;

    this.setState({
      showModal: !showModal
    });
  };

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

  freezeBounty = async (bountyAddress) => {
    try {
      const { account, web3 } = this.props.data;

      const instance = await getContractInstance(
        web3,
        BountyContract,
        bountyAddress
      );

      await instance.methods.toggleEmergencyStop().send({ from: account });

      return true;
    } catch (error) {
      return false;
    }
  };

  render() {
    const { account, bountyDetails } = this.props.data;
    const {
      bountyTotal,
      bountyDescription,
      voteDeposit,
      challengeDuration,
      voteDuration,
      isLoading,
      showModal
    } = this.state;

    if (isLoading) {
      return (
        <div>
          <p>Doing IPFS magic, brb...</p>
        </div>
      );
    }

    return (
      <div className={css(styles.bountyBoard_container)}>
        {showModal && (
          <Modal onCloseRequest={() => this.handleToggleModal()}>
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
          </Modal>
        )}

        <div className={css(styles.bountyBoard_header)}>
          <h1>Bounty Board</h1>

          <input
            type="button"
            value="+"
            className={css(styles.modalButton)}
            onClick={() => this.handleToggleModal()}
          />
        </div>

        <div className={css(styles.bountyBoard_body)}>
          <BountyList
            data={{ account, bountyDetails }}
            uploadFile={this.uploadFile}
            freezeBounty={this.freezeBounty}
          />
        </div>
      </div>
    );
  }
}

export default BountyBoard;

const styles = StyleSheet.create({
  bountyBoard_container: {
    width: '800px'
  },
  bountyBoard_header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '25px',
    fontSize: '2.5rem',
    fontWeight: '800'
  },
  modalButton: {
    width: '35px',
    height: '35px',
    border: '0',
    borderRadius: '50%',
    marginLeft: '16px',
    backgroundColor: '#568db2',
    fontSize: '1.6rem',
    fontWeight: '900',
    color: '#fff',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#466d87'
    }
  },
  bountyBoard_body: {
    display: 'flex',
    justifyContent: 'center'
  }
});
