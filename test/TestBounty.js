var Bounty = artifacts.require('./Bounty.sol');
var BountyBoard = artifacts.require('./BountyBoard.sol');

contract('Bounty', async (accounts) => {
  // var contractAddress;

  // beforeEach(function() {
  //   return Bounty.new().then(function(instance) {
  //     contractAddress = instance;
  //   });
  // });

  function timeTravel(time) {
    var id = 0;

    return new Promise((resolve, reject) => {
      web3.currentProvider.sendAsync(
        {
          jsonrpc: '2.0',
          method: 'evm_increaseTime',
          params: [time], // 86400 is num seconds in day
          id: new Date().getTime()
        },
        (err1) => {
          if (err1) {
            console.log(err);
            return reject(err1);
          }

          web3.currentProvider.sendAsync(
            {
              jsonrpc: '2.0',
              method: 'evm_mine',
              id: id++
            },
            (err2, result) => {
              if (err2) {
                console.log(err2);
                return reject(err2);
              }
              return resolve(result);
            }
          );
        }
      );
    });
  }

  it('Modifiers should change state of "Status" variable and allow function calls during corresponding time intervals.', async () => {
    let parentContract = await BountyBoard.deployed();

    await parentContract.createBountyContract(
      300000000000000000,
      'Initialize bounty contract',
      10000000000000000,
      86400,
      86400,
      { from: accounts[0], value: 300000000000000000 }
    );

    let bountyAddresses = await parentContract.getAllBountyAddresses();
    let childContract = await Bounty.at(bountyAddresses[0]);
    let statusChallenge;

    statusChallenge = await childContract.getBountyParameters();

    console.log(statusChallenge[5].c[0]);

    assert.equal(
      statusChallenge[5].c[0],
      0,
      'Status should equal 0 (Challenge)'
    );

    await timeTravel(86401 * 3);

    statusChallenge = await childContract.getBountyParameters();

    console.log(statusChallenge[5].c[0]);

    assert.equal(statusChallenge[5].c[0], 1, 'Status should equal 1 (Commit)');
  });

  // it('Modifiers should allow function calls during corresponding time intervals.', async () => {
  //   let parentContract = await BountyBoard.deployed();

  //   await parentContract.createBountyContract(
  //     300000000000000000,
  //     'Initialize bounty contract',
  //     10000000000000000,
  //     86400,
  //     86400,
  //     { from: accounts[0], value: 300000000000000000 }
  //   );

  //   let bountyAddresses = await parentContract.getAllBountyAddresses();

  //   let childContract = await Bounty.at(bountyAddresses[0]);

  //   // Move to seperate test
  //   // await childContract.submitChallenge(
  //   //   'https://gateway.ipfs.io/ipfs/QmYjh5NsDc6LwU3394NbB42WpQbGVsueVSBmod5WACvpte'
  //   // );

  //   timeTravel()
  // });
});
