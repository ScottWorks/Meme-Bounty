var BountyBoard = artifacts.require('./BountyBoard.sol');

contract('BountyBoard', async (accounts) => {
  var contract;

  beforeEach(function() {
    return BountyBoard.new().then(function(instance) {
      contract = instance;
    });
  });

  it('Bounty contract address array should be empty', async () => {
    let bountyAddressArray = await contract.getAllBountyAddresses.call();

    assert.lengthOf(bountyAddressArray, 0);
  });

  it('Bounty contract should fail if incorrect amount is sent.', async () => {
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
      assert.ok(error instanceof Error, 'should throw an error message');
    }

    let bountyAddressArray = await contract.getAllBountyAddresses.call();

    assert.lengthOf(bountyAddressArray, 0);
  });

  it('Bounty contract should fail if poster deposit is the wrong type.', async () => {
    const num = 300000000000000000;

    try {
      await contract.createBountyContract(
        num.toString(),
        'Poster deposit is the wrong type',
        10000000000000000,
        86400,
        86400,
        { from: accounts[0], value: 300000000000000000 }
      );
    } catch (error) {
      assert.ok(error instanceof Error, 'should throw an error message');
    }

    let bountyAddressArray = await contract.getAllBountyAddresses.call();
    console.log(bountyAddressArray);
    assert.lengthOf(bountyAddressArray, 0);
  });

  it('Bounty contract emits an event containing the address of the bounty contract', async () => {
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

    let bountyAddressArray = await contract.getAllBountyAddresses.call();

    assert.equal(
      eventEmitted,
      true,
      'address event has been emitted successfully'
    );
    assert.lengthOf(bountyAddressArray, 1);
  });

  it('Bounty contract should be created successfully.', async () => {
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
