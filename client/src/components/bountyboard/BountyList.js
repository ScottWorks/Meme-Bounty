import React from 'react';

import BountyCard from './BountyCard';

function BountyList(props) {
  const { uploadFile, redirectToBounty } = props;
  const { bountyDetails } = props.state;
  return (
    <div className="BountyBoard">
      <h1>Bounty Board</h1>
      {bountyDetails.map((elem, i) => {
        return (
          <div key={i}>
            <BountyCard
              state={{ elem }}
              uploadFile={uploadFile}
              redirectToBounty={redirectToBounty}
            />
          </div>
        );
      })}
    </div>
  );
}

export default BountyList;
