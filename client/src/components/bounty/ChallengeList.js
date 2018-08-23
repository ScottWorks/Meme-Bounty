import React from 'react';
import { StyleSheet, css } from 'aphrodite';

import ChallengeCard from './ChallengeCard';

function ChallengeList(props) {
  const { upVoteChallenge } = props;
  const { ipfsUrls } = props.data;

  return (
    <div>
      {ipfsUrls.map((elem, i) => {
        return (
          <div key={i}>
            <ChallengeCard data={{ elem }} upVoteChallenge={upVoteChallenge} />
          </div>
        );
      })}
    </div>
  );
}

export default ChallengeList;
