import React from 'react';
import { StyleSheet, css } from 'aphrodite';

import KillSwitch from '../common/KillSwitch';

function BountyCard(props) {
  const { freezeBounty, uploadFile } = props;
  const { account, elem } = props.data;

  return (
    <div>
      {account === elem.owner ? (
        <div className={css(styles.hidden_container)}>
          Bounty Kill-Switch
          <KillSwitch
            status={elem.status}
            freezeBounty={() => freezeBounty(elem.bountyAddress)}
          />
        </div>
      ) : null}
      <div
        className={css(styles.bountyCard_container)}
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

        <div className={css(styles.right_container)}>
          <input
            type="file"
            onChange={(e) => uploadFile(e, elem.bountyAddress)}
          />
        </div>
      </div>
    </div>
  );
}

export default BountyCard;

const styles = StyleSheet.create({
  bountyCard_container: {
    display: 'flex',
    justifyContent: 'space-around',
    height: '150px',
    margin: '32px 24px',
    padding: '24px',
    border: '3px solid black',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'pink'
    }
  },
  left_container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '25%'
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
    width: '25%'
  },
  hidden_container: {
    position: 'relative',
    top: '0',
    left: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
});
