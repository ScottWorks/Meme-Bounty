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
    // width: '625px',
    // height: '150px',
    // margin: '32px 24px',
    // border: '3px solid black',
    // cursor: 'pointer',
    // ':hover': {
    //   backgroundColor: 'pink'
    // }
  },
  details_container: {
    display: 'flex',
    flexDirection: 'space-around',
    width: '625px',
    height: '150px',
    margin: '48px 24px',
    padding: '24px',
    border: '3px solid black',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'pink'
    }
  },
  link: {
    display: 'flex',
    width: '100%',
    height: '100%',
    ':hover': {
      backgroundColor: 'pink'
    }
  },
  left_container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%'
  },
  center_container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%'
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
    // border: '2px solid gray',
    backgroundColor: 'white',
    // padding: '8px 20px',
    borderRadius: '8px',
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
