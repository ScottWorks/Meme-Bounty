import React from 'react';

import BountyCard from './BountyCard';

function BountyList(props) {
  const { uploadFile } = props;
  const { childrenContractDetails } = props.state;
  return (
    <div className="BountyBoard">
      <h1>Bounty Board</h1>
      {childrenContractDetails.map((elem, i) => {
        return (
          <div key={i}>
            <BountyCard state={{ elem }} uploadFile={uploadFile} />
          </div>
        );
      })}
    </div>
  );
}

export default BountyList;
