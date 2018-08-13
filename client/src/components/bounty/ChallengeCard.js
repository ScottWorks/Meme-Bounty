import React from 'react';

function ChallengeCard(props) {
  return (
    <div>
      <img src={props.data.elem} />
    </div>
  );
}

export default ChallengeCard;
