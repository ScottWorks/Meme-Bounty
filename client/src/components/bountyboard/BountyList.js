import React from 'react';

import BountyCard from './BountyCard';

function BountyList(props) {
  const { childrenContractDetails } = props.state;
  return (
    <div className="BountyBoard">
      <h1>Bounty Board List</h1>
      {childrenContractDetails.map((elem, i) => {
        return (
          <div key={i}>
            <BountyCard state={{ elem }} />
          </div>
        );
      })}
    </div>
  );
}

export default BountyList;
