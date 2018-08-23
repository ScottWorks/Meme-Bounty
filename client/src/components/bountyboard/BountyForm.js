import React from 'react';
import { StyleSheet, css } from 'aphrodite';

function BountyForm(props) {
  const { data, handleChange, createBounty } = props;

  return (
    <form className={css(styles.form)} onSubmit={(e) => createBounty(e)}>
      <label htmlFor="Bounty-Total">Bounty Total (Ξ): </label>
      <input
        name="Bounty-Total"
        type="number"
        value={data.bountyTotal}
        onChange={(e) => handleChange('bountyTotal', e.target.value)}
        required
      />
      <br />
      <br />

      <label htmlFor="Bounty-Description">Bounty Description: </label>
      <input
        name="Bounty-Description"
        type="text"
        value={data.bountyDescription}
        onChange={(e) => handleChange('bountyDescription', e.target.value)}
        required
      />
      <br />
      <br />

      <label htmlFor="Vote-Deposit">Vote Deposit (Ξ): </label>
      <input
        name="Vote-Deposit"
        type="number"
        value={data.voteDeposit}
        onChange={(e) => handleChange('voteDeposit', e.target.value)}
        required
      />
      <br />
      <br />

      <label htmlFor="Challenge-Duration">Challenge Duration (hr): </label>
      <input
        name="Challenge-Duration"
        type="number"
        value={data.challengeDuration}
        onChange={(e) => handleChange('challengeDuration', e.target.value)}
        required
      />
      <br />
      <br />

      <label htmlFor="Vote-Duration">Vote Duration (hr): </label>
      <input
        name="Vote-Duration"
        type="number"
        value={data.voteDuration}
        onChange={(e) => handleChange('voteDuration', e.target.value)}
        required
      />
      <br />
      <br />

      <input type="submit" value="Submit" />
    </form>
  );
}

export default BountyForm;

const styles = StyleSheet.create({
  form: {
    textAlign: 'center',
    width: '700px',
    padding: '3%'
  },
  inputField: {},
  submitButton: {}
});
