import timeConversion from './timeConversion';

const formatData = (web3, inputData) => {
  let status, timeLeft;
  let creationDate = timeConversion.fromEpoch(inputData[3], 'MM-DD-YYYY');
  const currTime = timeConversion.getCurrentTime();

  let creationTimestamp = parseInt(inputData[3], 10);
  let challengeDuration = parseInt(inputData[7], 10);
  let voteDuration = parseInt(inputData[8], 10);

  if (inputData[13]) {
    status = 'Inactive';
  } else if (currTime < creationTimestamp + challengeDuration) {
    timeLeft = creationTimestamp + challengeDuration - currTime;
    status = 'Challenge';
  } else if (
    currTime > creationTimestamp + challengeDuration &&
    currTime < creationTimestamp + challengeDuration + voteDuration
  ) {
    timeLeft = creationTimestamp + challengeDuration + voteDuration - currTime;
    status = 'Commit';
  } else if (
    currTime > creationTimestamp + challengeDuration + voteDuration &&
    currTime < creationTimestamp + challengeDuration + voteDuration + 300
  ) {
    timeLeft =
      creationTimestamp + challengeDuration + voteDuration + 300 - currTime;
    status = 'Reveal';
  } else if (
    currTime >
    creationTimestamp + challengeDuration + voteDuration + 300
  ) {
    status = 'Withdraw';
  } else {
    status = 'Error';
  }

  return {
    bountyAddress: inputData[0],
    owner: inputData[1],
    posterDeposit: web3.utils.fromWei(inputData[2], 'ether'),
    creationTimestamp: creationTimestamp,
    creationDate: creationDate,
    description: inputData[4],
    status: status,
    voterDeposit: web3.utils.fromWei(inputData[6], 'ether'),
    challengeDuration: challengeDuration,
    voteDuration: voteDuration,
    totalVoterCount: inputData[9],
    voterDepositTotal: web3.utils.fromWei(inputData[10], 'ether'),
    voterPayout: web3.utils.fromWei(inputData[11], 'ether'),
    bountyWinner: inputData[12],
    timeLeft: convertTimeLeft(timeLeft)
  };
};

const convertTimeLeft = (time) => {
  let _time;

  if (time >= 86400) {
    _time = Math.round(time / 86400);
    return `${_time} days`;
  } else if (time < 60) {
    return `${time} seconds`;
  } else if (time < 3600) {
    _time = Math.round(time / 60);
    return `${_time} minutes`;
  } else if (time < 86400) {
    _time = Math.round(time / 3600);
    return `${_time} hours`;
  }
};

export default formatData;
