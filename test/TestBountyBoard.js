var BountyBoard = artifacts.require('./BountyBoard.sol');

contract('BountyBoard', async (accounts) => {
  var contractAddress;

  beforeEach(function() {
    return BountyBoard.new().then(function(instance) {
      contractAddress = instance;
    });
  });

  it('Bounty contract address array should be empty', async () => {
    let bountyAddresses = await contractAddress.getAllBountyAddresses();

    assert.lengthOf(bountyAddresses, 0);
  });

  it('Bounty contract should fail if incorrect amount is sent', async () => {
    try {
      await contractAddress.createBountyContract(
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

    let bountyAddresses = await contractAddress.getAllBountyAddresses();

    assert.lengthOf(bountyAddresses, 0);
  });

  it('Bounty contract emits an event containing the address of the bounty contract', async () => {
    let eventEmitted = false;

    let event = contractAddress.LogAddress();

    await event.watch((err, res) => {
      if (res) {
        return (eventEmitted = true);
      }
    });

    await contractAddress.createBountyContract(
      300000000000000000,
      'Bounty contract should emit a log event',
      10000000000000000,
      86400,
      86400,
      { from: accounts[0], value: 300000000000000000 }
    );

    let bountyAddresses = await contractAddress.getAllBountyAddresses();

    assert.equal(
      eventEmitted,
      true,
      'address event has been emitted successfully'
    );
    assert.lengthOf(bountyAddresses, 1);
  });

  it('Bounty contract should be created successfully', async () => {
    await contractAddress.createBountyContract(
      300000000000000000,
      'Bounty contract initialization test',
      10000000000000000,
      86400,
      86400,
      { from: accounts[0], value: 300000000000000000 }
    );

    let bountyAddresses = await contractAddress.getAllBountyAddresses();

    assert.lengthOf(bountyAddresses, 1);
  });

  it('Tests SafeMath functions that were imported into contract', async () => {
    await contractAddress.setMath(4, 6);

    let result = await contractAddress.getMath();

    assert(result, 10, 'Result should equal 10');
  });
});
