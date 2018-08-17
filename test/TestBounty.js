var Bounty = artifacts.require('./Bounty.sol');
var BountyBoard = artifacts.require('./BountyBoard.sol');

contract('Bounty', async (accounts) => {
  const poster = accounts[0];
  const challenger = accounts[1];
  const voter = accounts[2];

  const jsonrpc = '2.0';
  const id = 0;

  var parentContract;
  var childContract;

  beforeEach(async () => {
    parentContract = await BountyBoard.new();

    await parentContract.createBountyContract(
      300000000000000000,
      'Bounty contract initialization test',
      10000000000000000,
      86400,
      86400,
      { from: poster, value: 300000000000000000 }
    );

    let bountyAddresses = await parentContract.getAllBountyAddresses();
    childContract = await Bounty.at(bountyAddresses[0]);
  });

  const send = (method, params = []) =>
    web3.currentProvider.send({ id, jsonrpc, method, params });

  const timeTravel = async (seconds) => {
    await send('evm_increaseTime', [seconds]);
    await send('evm_mine');
  };

  it('"Status" should default to 0 (Challenge)', async () => {
    let statusChallenge = await childContract.getBountyParameters();

    assert.equal(
      statusChallenge[5].c[0],
      0,
      'Status should equal 0 (Challenge)'
    );
  });

  it('Correct IPFS URL is returned', async () => {
    await childContract.submitChallenge('12345', { from: challenger });

    let challengerAddresses = await childContract.getAllChallengerAddresses();

    let ipfsUrl = await childContract.getIpfsUrl(challengerAddresses[0]);

    assert.equal(ipfsUrl, 12345, 'IPFS URL from contract matches ');
  });

  it('"isCommitPeriod" modifier should change "Status" to 1 (Commit)', async () => {
    await childContract.submitChallenge('12345', { from: challenger });

    await timeTravel(86401);

    await childContract.submitVoteDeposit({
      from: voter,
      value: 10000000000000000
    });

    let statusChallenge = await childContract.getBountyParameters();
    assert.equal(statusChallenge[5].c[0], 1, 'Status should equal 1 (Commit)');
  });

  it('"isRevealPeriod" modifier should change "Status" to 2 (Reveal)', async () => {
    await childContract.submitChallenge('12345', { from: challenger });

    await timeTravel(86401);

    await childContract.submitVoteDeposit({
      from: voter,
      value: 10000000000000000
    });
    await childContract.submitCommit(
      '0x474ba869830f6f6de3e63b111c2cdea42d1dfa74a4ae62704e0531cd0402e685',
      { from: voter }
    );

    await timeTravel(86401);

    await childContract.revealCommit(
      '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef',
      '12345',
      { from: voter }
    );

    let statusChallenge = await childContract.getBountyParameters();
    assert.equal(statusChallenge[5].c[0], 2, 'Status should equal 2 (Reveal)');
  });

  it('"isWithdrawalPeriod" modifier should change "Status" to 3 (Withdrawal)', async () => {
    await childContract.submitChallenge('12345', { from: challenger });

    await timeTravel(86401);

    await childContract.submitVoteDeposit({
      from: voter,
      value: 10000000000000000
    });
    await childContract.submitCommit(
      '0x474ba869830f6f6de3e63b111c2cdea42d1dfa74a4ae62704e0531cd0402e685',
      { from: voter }
    );

    await timeTravel(86401);

    await childContract.revealCommit(
      '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef',
      '12345',
      { from: voter }
    );

    await timeTravel(86401 * 2);

    await childContract.withdrawFunds({ from: voter });

    let statusChallenge = await childContract.getBountyParameters();
    assert.equal(
      statusChallenge[5].c[0],
      3,
      'Status should equal 3 (Withdrawal)'
    );
  });
});
