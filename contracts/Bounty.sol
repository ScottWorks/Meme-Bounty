pragma solidity ^0.4.18;

import "../libraries/SafeMath.sol";
import "../libraries/ReentrancyGuard.sol";


contract Bounty is ReentrancyGuard {

    using SafeMath for uint256;



// =========
// VARIABLES
// =========



    address ownerAddress;
    uint posterDeposit;
    uint creationTimestamp;
    string description;
    uint voterDeposit;
    uint challengeDuration;
    uint voteDuration;
    bool isInitialized = false;
    bool isStopped = false;
    
    uint totalVoterCount;
    uint winningVoterCount;
    uint voterDepositTotal; 
    uint voterPayout;
    
    enum Status{
        Challenge,
        Commit,
        Reveal,
        Withdraw,
        Inactive
    }

    Status private status; 

    address private bountyWinner;

    struct Challenge {
        string ipfsUrl;
        uint submissionTimestamp;
        uint upVotes;
        address[] voted;
    }

    mapping(address => Challenge) challengerAddress;
    address[] challengerAddresses;

    struct Vote {
        uint deposit;
        bytes32[] commitHash; 
        uint upVotesAvailable;
    }

    mapping(address => Vote) voter;
    address[] voterAddresses;



// ==================
// FUNCTION MODIFIERS
// ==================



    ///@dev locks out function from being called outside of Challenge period and updates state of status (if needed)

    modifier isChallengePeriod(){
        require(now < creationTimestamp + challengeDuration, "Challenge period has ended.");
        if(status != Status.Challenge){
            status = Status.Challenge;
        }
        _;
    }


    ///@dev locks out function from being called outside of Commit period and updates state of status (if needed)

    modifier isCommitPeriod(){
        require(now > creationTimestamp + challengeDuration, "Commit period has not started.");
        require(now < creationTimestamp + challengeDuration + voteDuration, "Commit period has ended.");
        if(status != Status.Commit){
            status = Status.Commit;
        }
        _;
    }


    ///@dev locks out function from being called outside of Reveal period and updates state of status (if needed)

    modifier isRevealPeriod(){
        require(now > creationTimestamp + challengeDuration + voteDuration, "Reveal period has not started.");
        require(now < creationTimestamp + challengeDuration + voteDuration + 5 minutes, "Reveal period has ended.");
        if(status != Status.Reveal){
            status = Status.Reveal;
        }        
        _;
    }


    ///@dev locks out function from being called outside of Withdrawal period and updates state of status (if needed)
    
    modifier isWithdrawalPeriod(){
        require(now > creationTimestamp + challengeDuration + voteDuration + 5 minutes, "Polling period has not started.");
        if(status != Status.Withdraw){
            status = Status.Withdraw;
        }        
        _;
    }


    ///@dev emergency stop that can potentially stop malicious actors
    modifier isNotStopped(){
        require(!isStopped, "Contract has been frozen by authorized party.");
        _;
    }


// ==========
// EVENT LOGS
// ==========



    event LogAddress(address); // FOR TESTING ONLY
    event LogString(bytes); // FOR TESTING ONLY
    event LogCommit(bytes32[]); // FOR TESTING ONLY
    event LogAddressArraySize(uint); // FOR TESTING ONLY
    event LogHash(bytes32); // FOR TESTING ONLY
    event LogBool(bool); // FOR TESTING ONLY



// ===========
// CONSTRUCTOR
// ===========



    constructor(
        uint _posterDeposit, 
        address _owner,
        string _description,
        uint _voterDeposit,
        uint _challengerDuration,
        uint _voteDuration
        ) 
    public 
    payable
    {
        require(msg.value >= _posterDeposit, "Insufficient funds, ETH sent must be equal to bounty deposit");

        require(!isInitialized, "Bounty is not modifiable");

        posterDeposit = _posterDeposit;
        ownerAddress = _owner;
        description = _description;
        voterDeposit = _voterDeposit;
        challengeDuration = _challengerDuration;
        voteDuration = _voteDuration;
        status = Status.Challenge;
        creationTimestamp = now;

        isInitialized = true;
    }



// =================
// GENERAL INTERFACE
// =================



    /// @dev when isStopped is equal to 'true', users will not be able to interact with the bounty.

    function toggleEmergencyStop()
    public
    {
        require(msg.sender == ownerAddress, "Authorized users only!");
        if(isStopped){
            isStopped = false;
        } else {
            isStopped = true;
        }
    }


    /** @dev provides the bouty parameters
    *   @return bounty parameters
    */

    function getBountyParameters()
    public
    view
    returns(
        address,
        address,
        uint,
        uint,
        string,
        Status,
        uint,
        uint,
        uint,
        uint,
        uint,
        uint, 
        uint,
        bool
    )
    {

        return(            
            address(this),
            ownerAddress,
            posterDeposit,
            creationTimestamp, 
            description,
            status,
            voterDeposit,
            challengeDuration,
            voteDuration,
            totalVoterCount,
            winningVoterCount,
            voterDepositTotal,
            voterPayout,
            isStopped
        );
    }


    /** @dev provides an array of challenger addresses to caller
    *   @return array of challenger addresses
    */

    function getAllChallengerAddresses() 
    public
    view 
    returns(address[])
    {
        return challengerAddresses;
    }


    /** @dev provides the IPFS URL corresponding to the challenger address provided
    *   @param _challengerAddress - the address of the challenger
    *   @return IPFS URL corresponging to the challenger
    */

    function getIpfsUrl(address _challengerAddress)
    public
    view
    returns(string)
    {  
        Challenge storage _challenger = challengerAddress[_challengerAddress];

        return _challenger.ipfsUrl;
    }
    

    function getBountyWinner()
    public
    view
    // isWithdrawalPeriod
    returns(
        address,
        uint, 
        uint
    )
    {
        Challenge storage winner = challengerAddress[bountyWinner];

        return(
            bountyWinner,
            winner.submissionTimestamp,
            winner.upVotes
        );
    }



// ====================
// CHALLENGER INTERFACE
// ====================



    /** @dev Maps sender address to Challenge Struct then adds the IPFS URL, submission timestamp, and indicates the challenger has submitted content already. The address of the challenger is also added to an array that contains all challenger addresses.
    *   @param _ipfsUrl - URL of content submitted to IPFS
    */

    function submitChallenge(string _ipfsUrl) 
    public
    isNotStopped
    isChallengePeriod
    {  
        Challenge storage _challenger = challengerAddress[msg.sender];

        bool flag = false;

        // Prevents duplicate addresses from populating challengerAddresses array
        for(uint i = 0; i < challengerAddresses.length; i++){
            if(challengerAddresses[i] == msg.sender){
                flag = true; 
                break;
            }
        }

        // Only add non-duplicate addresses
        if(!flag){
            challengerAddresses.push(msg.sender);
        }
        
        _challenger.ipfsUrl = _ipfsUrl;
        _challenger.submissionTimestamp = now;
    }   



// ===============
// VOTER INTERFACE
// ===============



    /** @dev user sends correct amount of ETH (should be equal to or greater than the 'VoterDeposit'), in return they are allowed to submit one vote
    */

    function submitVoteDeposit()
    public
    payable
    isNotStopped
    isCommitPeriod
    {
        require(msg.value >= voterDeposit, "Insufficient funds");

        Vote storage _voter = voter[msg.sender];

        _voter.deposit += msg.value;
        _voter.upVotesAvailable++;
        voterAddresses.push(msg.sender);

        totalVoterCount = voterAddresses.length;
    }


    /** @dev user creates a commit hash and submits the result and stores it in an array associated with the voters address. The number of votes availabe is then decremented.
    *   @param _commitHash - the hash of the challengerAddress and salt
    */

    function submitCommit(bytes32 _commitHash) 
    public 
    isNotStopped
    isCommitPeriod
    {
        Vote storage _voter = voter[msg.sender];

        // Checks that the voter has enough available votes
        require(_voter.upVotesAvailable > 0, "Not enough votes available");

        // Checks that the voter has deposited enough funds already deposited 
        require(_voter.deposit >= voterDeposit * _voter.upVotesAvailable, "Insufficient funds");

        _voter.commitHash.push(_commitHash);
        _voter.upVotesAvailable--;
    }


     /** @dev hashes the provided address and salt then matches the result to a value stored in commithash array, If a commit mataches the hash then the commit is removed from the array, the challenger is awarded an upvote and the voter is added to the challengers voted array, 
    *   @param _challengerAddress - the address of the challenger
    *   @param salt -a random number generated on the client
    */

    function revealCommit(bytes20 _challengerAddress, uint salt) 
    public 
    isNotStopped
    isRevealPeriod
    {

        Vote storage _voter = voter[msg.sender];
        Challenge storage _challenger = challengerAddress[address(_challengerAddress)];

        bytes32 revealHash = keccak256(abi.encodePacked(_challengerAddress, salt));
        
        bool flag = false; 

        for(uint i = 0; i < _voter.commitHash.length; i++){
            if(_voter.commitHash[i] == revealHash){
                delete _voter.commitHash[i];
                flag = true;
                break;
            }
        }

        // Checks that the hash matches at one of the commit hashes stored in the commitHash array 
        require(flag, "Submitted entry does not match any stored commit hashes.");

        _challenger.upVotes++; 
        _challenger.voted.push(msg.sender);

        declareWinner(address(_challengerAddress));
    }



// ==================
// WITHDRAW INTERFACE
// ==================



    /** @dev disburses winnings to the challenger or voter. In the case of the voter the address of the voter is checked against the addresses stored in the challengers voted array, If the address matches then it is removed from the voted array, funds are transferred to the caller.
    * NOTE: The 'nonReentrant' modifier ensures that the function is called only once. 
    */

    function withdrawFunds()
    external
    payable
    isNotStopped
    isWithdrawalPeriod
    nonReentrant
    {
        if(msg.sender == bountyWinner){
            bountyWinner.transfer(posterDeposit);

        } else {
            Challenge storage winner = challengerAddress[bountyWinner];

            winningVoterCount = winner.voted.length;
            voterDepositTotal = totalVoterCount * voterDeposit; 

            voterPayout = voterDepositTotal / winningVoterCount;

            bool flag = false; 
           
            for(uint i = 0; i < winner.voted.length; i++){
                if(winner.voted[i] == msg.sender){
                    delete winner.voted[i];
                    flag = true;
                    break;
                }
            }

            // Checks that the caller address matches an address stored in the voted array.
            require(flag, "Sorry, you bet on the wrong horse...");
            
            msg.sender.transfer(voterPayout);
        }        
    }



// ================
// HELPER FUNCTIONS
// ================



    /** @dev declares a winner by checking if the current challenger has more upvotes than the challenger with the highest number of upvotes. If there is a tie the challenger who submitted their content first is declared the winner.
    *   @param _challengerAddress - the address of the challenger
    */

    function declareWinner(address _challengerAddress) 
    private 
    isNotStopped
    isRevealPeriod
    {
        Challenge storage _challenger = challengerAddress[_challengerAddress];
        Challenge storage winner = challengerAddress[bountyWinner];

        if(_challenger.upVotes > winner.upVotes){
            bountyWinner = _challengerAddress;
        } else if(_challenger.upVotes == winner.upVotes) {
            if(_challenger.submissionTimestamp <= winner.submissionTimestamp){
                bountyWinner = _challengerAddress;
            } 
        }
    }
}