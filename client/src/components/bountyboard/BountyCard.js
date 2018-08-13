import React from 'react';

function BountyCard(props) {
  const { uploadFile, redirectToBounty } = props;
  const { elem } = props.data;

  return (
    <div className="BountyBoard">
      <p>Status: {elem.status}</p>
      <p>Contract Address: {elem.bountyAddress}</p>
      <p>Bounty Owner: {elem.owner}</p>
      <p>Bounty Total: {elem.posterDeposit}</p>
      <p>Bounty Description: {elem.description}</p>
      <p>Cost per Vote: {elem.voterDeposit}</p>
      <p>Total Votes: {elem.totalVoterCount}</p>
      <input
        type="button"
        value="View Challenges"
        onClick={() => redirectToBounty(elem)}
      />
      <input type="file" onChange={(e) => uploadFile(e, elem)} />
    </div>
  );
}

export default BountyCard;
