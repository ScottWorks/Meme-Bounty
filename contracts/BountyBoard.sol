pragma solidity ^0.4.18;

import "../libraries/SafeMath.sol";

import "./Bounty.sol";

contract BountyBoard {

    Bounty bountyContract;

    using SafeMath for uint256;
    
    uint c = 0;

    address[] bountyContractAddresses;
    mapping(address => Bounty) bountyContracts; 
 
    event LogAddress(address bountyContract);



// =================
// GENERAL FUNCTIONS
// =================


    /** @dev multiplies value of two parameters provided
    *   @param a - some number
    *   @param b - some number
    *   @return the result
    */

    function setMath(uint a, uint b)
    public
    returns(uint)
    {
        c = a.mul(b);
    }


    /** @dev provides the caller with the value of the c variable
    *   @return the c variables state
    */

    function getMath()
    public
    view
    returns(uint)
    {
        return c;
    }

    
    /** @dev provides an array of bounty contract addresses
    *   @return the bounty contract address array
    */

    function getAllBountyAddresses() 
    public 
    view 
    returns(address[]) 
    {
        return bountyContractAddresses;
    }



// ==================
// CONTRACT INTERFACE
// ==================



    /** @dev initializes a bounty contract with the parameters provided then emits an event containing the address of the new contract
    *   @param posterDeposit - specifies the amount the challenger will be awarded and the amount the poster must pay
    *   @param description - specifies the challenge to be fulfilled by the challengers
    *   @param voterDeposit - specifies the amount the voters must pay for upvotes
    *   @param challengeDuration - specifies the amount of time challengers have to submit content
    *   @param voteDuration - specifies the amount of time voters have to submit commits
    */

    function createBountyContract(
        uint posterDeposit, 
        string description, 
        uint voterDeposit, 
        uint challengeDuration, 
        uint voteDuration
        ) 
    public 
    payable
    {        
        address owner = msg.sender;

        bountyContract = (new Bounty).value(msg.value)(
        posterDeposit,
        owner, 
        description, 
        voterDeposit, 
        challengeDuration, 
        voteDuration
        );

        bountyContractAddresses.push(bountyContract);

        emit LogAddress(bountyContract);
    }
}