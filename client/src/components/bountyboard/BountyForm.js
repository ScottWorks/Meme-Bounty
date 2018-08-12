import React from 'react';

function BountyForm(props) {
  const { state, handleChange, createBounty } = props;

  return (
    <form onSubmit={(e) => createBounty(e)}>
      <label htmlFor="Bounty-Total">Bounty Total (ETH): </label>
      <input
        name="Bounty-Total"
        type="number"
        value={state.bountyTotal}
        onChange={(e) => handleChange('bountyTotal', e.target.value)}
      />
      <br />
      <br />

      <label htmlFor="Bounty-Description">Bounty Description: </label>
      <input
        name="Bounty-Description"
        type="text"
        value={state.bountyDescription}
        onChange={(e) => handleChange('bountyDescription', e.target.value)}
      />
      <br />
      <br />

      <label htmlFor="Vote-Deposit">Vote Deposit (ETH): </label>
      <input
        name="Vote-Deposit"
        type="number"
        value={state.voteDeposit}
        onChange={(e) => handleChange('voteDeposit', e.target.value)}
      />
      <br />
      <br />

      <label htmlFor="Challenge-Duration">Challenge Duration (hr): </label>
      <input
        name="Challenge-Duration"
        type="number"
        value={state.challengeDuration}
        onChange={(e) => handleChange('challengeDuration', e.target.value)}
      />
      <br />
      <br />

      <label htmlFor="Vote-Duration">Vote Duration (hr): </label>
      <input
        name="Vote-Duration"
        type="number"
        value={state.voteDuration}
        onChange={(e) => handleChange('voteDuration', e.target.value)}
      />
      <br />
      <br />

      <input type="submit" value="Submit" />
    </form>
  );
}

export default BountyForm;
