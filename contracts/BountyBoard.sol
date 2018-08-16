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



    function setMath(uint a, uint b)
    public
    returns(uint)
    {
        c = a.mul(b);
    }

    function getMath()
    public
    view
    returns(uint)
    {
        return c;
    }

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