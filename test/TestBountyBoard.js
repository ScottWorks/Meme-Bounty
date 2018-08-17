var BountyBoard = artifacts.require('./BountyBoard.sol');

contract('BountyBoard', async (accounts) => {
  var contractAddress;

  beforeEach(function() {
    return BountyBoard.new().then(function(instance) {
      contractAddress = instance;
    });
  });

  // Rationale:
  // Before any bounty contracts have been created the bounty board contract should contain no bounties stored in the bountyAddresses array. If the array has a length after initialization it would indicate that a bug is forcing new bounty contracts to deploy.

  it('Bounty contract address array should be empty', async () => {
    let bountyAddresses = await contractAddress.getAllBountyAddresses();

    assert.lengthOf(bountyAddresses, 0);
  });

  // Rationale:
  // Verifies that the amount of Ether sent matches the amount specified in the bounty.If this value is lower than the amount specified in the bounty parameters then the challenger will less Ether than promised.

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

  // Rationale:
  // Verifies that the bounty contract was successfully created by checking that the address is contained in the event log. If the contract creation failed this event would not be emitted.

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

  // Rationale:
  // Verifies that the 'getAllBountyAddresses' contains the correct number of addresses. This is important as the front-end relies heavily on this function to provide it with the bounty contract addresses.

  it('Bounty contract should be created successfully', async () => {
    await contractAddress.createBountyContract(
      300000000000000000,
      'Bounty contract initialization test',
      10000000000000000,
      86400,
      86400,
      { from: accounts[0], value: 300000000000000000 }
    );

    await contractAddress.createBountyContract(
      300000000000000000,
      'Bounty contract initialization test',
      10000000000000000,
      86400,
      86400,
      { from: accounts[0], value: 300000000000000000 }
    );

    let bountyAddresses = await contractAddress.getAllBountyAddresses();

    assert.lengthOf(bountyAddresses, 2);
  });

  // Rationale:
  // Verifies that the setMath and getMath functions perform as expected.

  it('Tests SafeMath functions that were imported into contract', async () => {
    await contractAddress.setMath(4, 6);

    let result = await contractAddress.getMath();

    assert(result, 10, 'Result should equal 10');
  });
});
