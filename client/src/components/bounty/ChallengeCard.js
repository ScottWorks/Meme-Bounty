import React from 'react';

function ChallengeCard(props) {
  return (
    <div>
      <img src={props.data.elem} />
      <input type="button" value="UpVote" />
    </div>
  );
}

export default ChallengeCard;
