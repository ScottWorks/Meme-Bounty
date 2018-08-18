import React from 'react';

function ChallengeCard(props) {
  const { upVoteChallenge } = props;
  const { elem } = props.data;

  return (
    <div>
      <img src={elem.ipfsUrl} />
      <input
        type="button"
        value="UpVote"
        onClick={() => upVoteChallenge(elem.challengerAddress)}
      />
    </div>
  );
}

export default ChallengeCard;
