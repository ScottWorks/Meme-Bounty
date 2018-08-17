const SafeMath = artifacts.require('./SafeMath.sol');
const BountyBoard = artifacts.require('./BountyBoard.sol');

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, BountyBoard);
  deployer.deploy(BountyBoard);
};
