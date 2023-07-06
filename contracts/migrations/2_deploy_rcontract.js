// const Reviews = artifacts.require("./Reviews.sol");

// module.exports = function(deployer) {
//   deployer.deploy(Reviews);
// };
const SimpleContract = artifacts.require("./SimpleContract.sol");

module.exports = function (deployer) {
  deployer.deploy(SimpleContract);
};