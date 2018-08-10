const getContractInstance = async (
  web3,
  contractDefinition,
  contractAddress
) => {
  // get network ID and the deployed address
  const networkId = await web3.eth.net.getId();

  let deployedAddress;

  if (!contractAddress) {
    deployedAddress = contractDefinition.networks[networkId].address;
  } else {
    deployedAddress = contractAddress;
  }

  // create the instance
  const instance = new web3.eth.Contract(
    contractDefinition.abi,
    deployedAddress
  );
  return instance;
};

export default getContractInstance;
