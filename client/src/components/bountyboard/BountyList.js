import React from 'react';

import BountyCard from './BountyCard';

function BountyList(props) {
  const { freezeBounty, uploadFile } = props;
  const { account, bountyDetails } = props.data;
  return (
    <div className="BountyBoard">
      {bountyDetails.map((elem, i) => {
        return (
          <div key={i}>
            <BountyCard
              data={{ account, elem }}
              uploadFile={uploadFile}
              freezeBounty={freezeBounty}
            />
          </div>
        );
      })}
    </div>
  );
}

export default BountyList;
