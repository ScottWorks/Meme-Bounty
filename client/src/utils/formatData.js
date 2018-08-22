import { connect } from 'react-redux';

import timeConversion from './timeConversion';

const formatData = (web3, inputData) => {
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
};

export default formatData;
