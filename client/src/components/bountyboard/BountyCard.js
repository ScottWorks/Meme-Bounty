import React from 'react';

function BountyCard(props) {
  const { freezeBounty, uploadFile } = props;
  const { elem } = props.data;

  return (
    <div className="BountyBoard">
      {/* <p>Status: {elem.status}</p> */}
      <p>Contract Address: {elem.bountyAddress}</p>
      {/* <p>Bounty Owner: {elem.owner}</p> */}
      <p>Bounty Total: {elem.posterDeposit} Ξ</p>
      <p>Bounty Description: {elem.description}</p>
      <p>Cost per Vote: {elem.voterDeposit} Ξ</p>
      <p>Total Votes: {elem.totalVoterCount}</p>

      <button onClick={() => window.location.assign(`/${elem.bountyAddress}`)}>
        View Challenge
      </button>

      <input type="file" onChange={(e) => uploadFile(e, elem.bountyAddress)} />

      <button
        type="button"
        onClick={(e) => freezeBounty(e, elem.bountyAddress)}
      >
        Freeze Bounty
      </button>
    </div>
  );
}

export default BountyCard;
