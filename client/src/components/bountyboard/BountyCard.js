import React from 'react';

function BountyCard(props) {
  const { elem } = props.state;

  return (
    <div className="BountyBoard">
      <p>Bounty Owner: {elem[0]}</p>
      <p>Bounty Total: {elem[1]}</p>
      <p>Bounty Description: {elem[3]}</p>
      <p>Cost per Vote: {elem[5]}</p>
      <p>Total Votes: {elem[8]}</p>
    </div>
  );
}

export default BountyCard;
