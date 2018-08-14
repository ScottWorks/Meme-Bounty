pragma solidity ^0.4.18;

contract Bounty {



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
        bool hasSubmitted;
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



    modifier isChallengePeriod(){
        require(now < creationTimestamp + challengeDuration, "Challenge period has ended.");
        if(status != Status.Challenge){
            status = Status.Challenge;
        }
        _;
    }

    modifier isCommitPeriod(){
        require(now > creationTimestamp + challengeDuration, "Commit period has not started.");
        require(now < creationTimestamp + challengeDuration + voteDuration, "Commit period has ended.");
        if(status != Status.Commit){
            status = Status.Commit;
        }
        _;
    }

    modifier isRevealPeriod(){
        require(now > creationTimestamp + challengeDuration + voteDuration, "Reveal period has not started.");
        require(now < creationTimestamp + challengeDuration + voteDuration + 48 hours, "Reveal period has ended.");
        if(status != Status.Reveal){
            status = Status.Reveal;
        }        
        _;
    }
    
    modifier isWithdrawlPeriod(){
        require(now > creationTimestamp + challengeDuration + voteDuration + 48 hours, "Polling period has not started.");
        if(status != Status.Withdraw){
            status = Status.Withdraw;
        }        
        _;
    }



// ==========
// EVENT LOGS
// ==========



    event LogAddress(address);
    event LogString(bytes);
    event LogHash(bytes20, bytes32, bytes32);
    event LogAddressArraySize(uint);



// ===========
// CONSTRUCTOR
// ===========



    constructor(
        uint _posterDeposit, 
        address _owner,
        string _description,
        uint _voterDeposit,
        uint _challengerDeadline,
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
        challengeDuration = _challengerDeadline;
        voteDuration = _voteDuration;
        status = Status.Challenge;
        creationTimestamp = now;

        isInitialized = true;
    }



// =================
// GENERAL INTERFACE
// =================



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
        uint
    )
    {
        // getStatus();

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
            voterPayout
        );
    }

    /** @dev Returns array containing challenger addresses
    *   @return array of challenger addresses
    */
    function getAllChallengerAddresses() 
    public
    view 
    returns(address[])
    {
        return challengerAddresses;
    }

    function getIpfsUrl(address _challengerAddress)
    public
    view
    returns(string)
    {  
        Challenge storage _challenger = challengerAddress[_challengerAddress];

        return _challenger.ipfsUrl;
    }
    
    // function getUpvoteCount(address _challengerAddress)
    // public
    // view
    // returns(uint)
    // {
    //     Challenge storage _challenger = challengerAddress[_challengerAddress];
    //     return _challenger.upVotes;
    // }

    function getBountyWinner()
    public
    view
    // isWithdrawlPeriod
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



    /** @dev Maps sender address to deposit, IPFS Hash, timestamp, upVotes, and an array of voter addresses. Stores ETH deposited and updates the challenger addresss array
    *   @param _ipfsUrl - URL of content submitted to IPFS
    */
    function submitChallenge(string _ipfsUrl) 
    public
    // isChallengePeriod
    {  
        Challenge storage _challenger = challengerAddress[msg.sender];
        
        require(!_challenger.hasSubmitted, "Only one submission per Challenger");

        _challenger.ipfsUrl = _ipfsUrl;
        _challenger.submissionTimestamp = now;
        challengerAddresses.push(msg.sender);
        _challenger.hasSubmitted = true;
    }   



// ===============
// VOTER INTERFACE
// ===============



    function submitVoteDeposit()
    public
    payable
    // isCommitPeriod
    {
        require(msg.value >= voterDeposit, "Insufficient funds");

        Vote storage _voter = voter[msg.sender];

        _voter.deposit += msg.value;
        _voter.upVotesAvailable++;
        voterAddresses.push(msg.sender);

        totalVoterCount = voterAddresses.length;
    }

    function submitCommit(bytes32 _commitHash) 
    public 
    // isCommitPeriod
    {
        Vote storage _voter = voter[msg.sender];

        require(_voter.upVotesAvailable > 0, "Not enough votes available");
        require(_voter.deposit >= voterDeposit * _voter.upVotesAvailable, "Insufficient funds");

        _voter.commitHash.push(_commitHash);
        _voter.upVotesAvailable--;
    }

    function revealCommit(bytes20 _challengerAddress, uint salt) 
    public 
    // isRevealPeriod
    returns(address)
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

        require(flag, "Submitted entry does not match any stored commit hashes.");

        _challenger.upVotes++; 
        _challenger.voted.push(msg.sender);

        return declareWinner(address(_challengerAddress));
    }



// ==================
// WITHDRAW INTERFACE
// ==================



    function withdrawFunds()
    public
    payable
    // isWithdrawlPeriod
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

            require(flag, "Sorry, you bet on the wrong horse...");
            
            msg.sender.transfer(voterPayout);
        }        
    }



// ================
// HELPER FUNCTIONS
// ================



    function declareWinner(address _challengerAddress) 
    private 
    returns(address)
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

        return bountyWinner;
    }
}