## What is XBounty

Click here to learn more!

## Installation

Before getting started this guide assumes the following are installed:

- [NodeJS](https://nodejs.org/en/download/) 5.0 or later
- Windows, Linux, or Mac OS X

This project was developed using the [Truffle Framework](https://truffleframework.com/docs/truffle/overview), it offers alot of features that are very useful for developing Decentralized Applications on the Ethereum Network.

1. If you have not already done so install truffle globally `npm install -g truffle`

2. Next you should fork and clone the repo, once the repo is cloned issue the following command at the root of the directory `npm install`. In the Command-Line navigate to the client `cd ./client/` and enter `npm install` again.

3. When the all the packages have been installed we will launch a local version of the Ethereum blockchain that our smart contracts will intereact with. Navigate back to the root of the directory and enter the following `truffle develop`.

4. At this point we need to compile the smart contracts then migrate them by entering `compile` inside the Truffle Development Console followed by `migrate`.

5. Open a new instance of the CLI (should be at the directory root), then navigate to the client folder `cd ./client/`. At this point we are ready to launch the webpack server and begin interacting with the XBounty Client, enter `npm start` and have fun!
   :tada: :tada: :tada:

## Testing

1. Running the tests that are included in the test folder is a straightforward process. First make sure that you have completed steps 1 - 3 in the 'Installation' section.

2. In the Truffle Development console enter `test`, this should initiate a series of 10 tests that were written in JavaScript.
