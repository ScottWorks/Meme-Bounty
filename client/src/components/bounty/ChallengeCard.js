import React from 'react';

function ChallengeCard(props) {
  const { upVoteChallenge } = props;
  const { elem } = props.data;

  return (
    <div>
      <img src={elem} />
      <input type="button" value="UpVote" onClick={() => upVoteChallenge()} />
    </div>
  );
}

export default ChallengeCard;
