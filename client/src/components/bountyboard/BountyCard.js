import React from 'react';
import { StyleSheet, css } from 'aphrodite';

import KillSwitch from '../common/KillSwitch';

function BountyCard(props) {
  const { freezeBounty, uploadFile } = props;
  const { account, elem } = props.data;

  return (
    <div className={css(styles.bountyCard_container)}>
      {account === elem.owner ? (
        <div className={css(styles.hidden_container)}>
          Bounty Kill-Switch
          <KillSwitch
            status={elem.status}
            freezeBounty={() => freezeBounty(elem.bountyAddress)}
          />
        </div>
      ) : null}
      <div className={css(styles.details_container)}>
        <div
          className={css(styles.link)}
          onClick={() => window.location.assign(`/${elem.bountyAddress}`)}
        >
          <div className={css(styles.left_container)}>
            <p>Bounty Total: {elem.posterDeposit} Ξ</p>
            <p>Cost per Vote: {elem.voterDeposit} Ξ</p>
            <p>Votes: {elem.totalVoterCount}</p>
          </div>

          <div className={css(styles.center_container)}>
            <p>Description: {elem.description}</p>
            <p>Status: {elem.status}</p>
            <p>Time Left: {elem.timeLeft}</p>
          </div>
        </div>
        <div className={css(styles.right_container)}>
          <div className={css(styles.upload_container)}>
            <button className={css(styles.fakeUpload_button)}>
              Submit Challenge
            </button>
            <input
              className={css(styles.upload_button)}
              type="file"
              onChange={(e) => uploadFile(e, elem.bountyAddress)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BountyCard;

const styles = StyleSheet.create({
  bountyCard_container: {
    //
  },
  details_container: {
    display: 'flex',
    flexDirection: 'space-around',
    width: '700px',
    height: '150px',
    margin: '48px 24px',
    padding: '24px',
    border: '3.5px solid gray',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    backgroundColor: 'white',
    ':hover': {
      color: 'white',
      backgroundColor: 'grey'
    }
  },
  link: {
    display: 'flex',
    width: '100%',
    height: '100%',
    textAlign: 'left',
    ':hover': {
      color: 'white',
      backgroundColor: 'grey'
    }
  },
  left_container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'center',
    width: '40%',
    marginRight: '32px'
  },
  center_container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'center',
    width: '60%'
  },
  right_container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '25px'
  },
  hidden_container: {
    position: 'relative',
    top: '0',
    left: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '-32px'
  },
  upload_container: {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-block'
  },
  fakeUpload_button: {
    padding: '8px 16px',
    border: '2.5px solid gray',
    borderRadius: '8px',
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: '1rem'
  },
  upload_button: {
    fontSize: '50px',
    position: 'absolute',
    left: '0',
    top: '0',
    opacity: '0'
  }
});
