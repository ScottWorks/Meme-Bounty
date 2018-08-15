var BountyBoard = artifacts.require('./BountyBoard.sol');

contract('BountyBoard', async (accounts) => {
  var contract;

  beforeEach(function() {
    return BountyBoard.new().then(function(instance) {
      contract = instance;
    });
  });

  it('Bounty contract address array should be empty', async () => {
    // const instance = await BountyBoard.deployed();

    let bountyAddressArray = await contract.getAllBountyAddresses.call();

    assert.lengthOf(bountyAddressArray, 0);
  });

  it('Bounty contract should fail if incorrect amount is sent.', async () => {
    // const instance = await BountyBoard.deployed();

    try {
      await contract.createBountyContract(
        300000000000000000,
        'Bounty contract initialization test',
        10000000000000000,
        86400,
        86400,
        { from: accounts[0], value: 100000000000000000 }
      );
    } catch (error) {
      assert.ok(
        error instanceof Error,
        '... contract should throw an exception'
      );
    }
  });

  it('Bounty contract should fail if description is the wrong type.', async () => {
    // const contract = await BountyBoard.deployed();

    try {
      await contract.createBountyContract(
        300000000000000000,
        12345,
        10000000000000000,
        86400,
        86400,
        { from: accounts[0], value: 300000000000000000 }
      );
    } catch (error) {
      assert.ok(error instanceof Error, 'should throw an error message');
    }
  });

  it('Bounty contract emits an event containing the address of the bounty contract', async () => {
    // const contract = await BountyBoard.deployed();

    let eventEmitted = false;

    let event = contract.LogAddress();

    await event.watch((err, res) => {
      if (res) {
        return (eventEmitted = true);
      }
    });

    await contract.createBountyContract(
      300000000000000000,
      'Bounty contract should emit a log event.',
      10000000000000000,
      86400,
      86400,
      { from: accounts[0], value: 300000000000000000 }
    );

    assert.equal(
      eventEmitted,
      true,
      'address event has been emitted successfully'
    );
  });

  it('Bounty contract should be created successfully.', async () => {
    // const contract = await BountyBoard.deployed();

    await contract.createBountyContract(
      300000000000000000,
      'Bounty contract initialization test',
      10000000000000000,
      86400,
      86400,
      { from: accounts[0], value: 300000000000000000 }
    );

    let bountyAddressArray = await contract.getAllBountyAddresses.call();

    assert.lengthOf(bountyAddressArray, 1);
  });
});
