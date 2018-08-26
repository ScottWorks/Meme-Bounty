import React from 'react';
import { StyleSheet, css } from 'aphrodite';

function ChallengeCard(props) {
  const { upVoteChallenge } = props;
  const { elem, status } = props.data;

  const upVoteButton =
    status === 'Commit' ? (
      <input
        className={css(styles.upvote_button)}
        type="button"
        value="UpVote"
        onClick={() => upVoteChallenge(elem.challengerAddress)}
      />
    ) : (
      <input
        className={css(styles.upvote_button)}
        type="button"
        value="UpVote"
        onClick={() => upVoteChallenge(elem.challengerAddress)}
        disabled
      />
    );

  return (
    <div className={css(styles.challenge_container)}>
      <img className={css(styles.image)} src={elem.ipfsUrl} />
      {upVoteButton}
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
    width: '100px',
    margin: '24px',
    border: '2.5px solid gray',
    backgroundColor: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '1rem',
    ':enabled': {
      cursor: 'pointer',
      ':hover': {
        color: 'white',
        backgroundColor: 'grey'
      }
    },
    ':disabled': {
      backgroundColor: 'white'
    }
  }
});
