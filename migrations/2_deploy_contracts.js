const BountyBoard = artifacts.require('./BountyBoard.sol');

module.exports = function(deployer) {
  deployer.deploy(BountyBoard);
};
