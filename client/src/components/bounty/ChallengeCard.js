import React from 'react';
import { StyleSheet, css } from 'aphrodite';

function ChallengeCard(props) {
  const { upVoteChallenge } = props;
  const { elem } = props.data;

  return (
    <div className={css(styles.challenge_container)}>
      <img className={css(styles.image)} src={elem.ipfsUrl} />
      <input
        className={css(styles.upvote_button)}
        type="button"
        value="UpVote"
        onClick={() => upVoteChallenge(elem.challengerAddress)}
      />
    </div>
  );
}

export default ChallengeCard;

const styles = StyleSheet.create({
  challenge_container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '48px'
  },
  image: {
    display: 'block',
    maxWidth: '700px',
    maxHeight: '700px',
    width: 'auto',
    height: 'auto'
  },
  upvote_button: {
    width: '80px',
    margin: '24px'
  }
});
