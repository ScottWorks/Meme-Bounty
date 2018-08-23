import React, { Component } from 'react';
import Identicon from 'identicon.js';

import getWeb3 from '../../utils/getWeb3';
import { StyleSheet, css } from 'aphrodite';

class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      web3: null,
      account: null,
      balance: null,
      icon: null
    };
  }

  componentDidMount = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    const balance = await web3.eth.getBalance(account);
    const balanceInEther = web3.utils.fromWei(balance, 'ether');
    const balanceRounded = Number.parseFloat(balanceInEther).toPrecision(6);

    const icon = new Identicon(account, 65).toString();

    this.setState({
      web3: web3,
      account: account,
      balance: balanceRounded,
      icon: icon
    });
  };

  render() {
    const { account, balance, icon } = this.state;
    return (
      <div className={css(styles.navbar_container)}>
        <div className={css(styles.icon_container)}>
          <img src={`data:image/png;base64,${icon}`} />
        </div>

        <div className={css(styles.accountDetails_container)}>
          <p className={css(styles.accountDetails)}>{account}</p>
          <p className={css(styles.accountDetails)}>{balance} Ξ</p>
        </div>

        <div className={css(styles.link_container)}>
          <a
            className={css(styles.link)}
            href="/"
            onClick={() => window.location.assign(`/`)}
          >
            XB
          </a>
        </div>
      </div>
    );
  }
}

export default Navbar;

const styles = StyleSheet.create({
  navbar_container: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '75px',
    marginBottom: '50px'
  },
  accountDetails_container: {
    marginLeft: '15px',
    fontSize: 'medium',
    fontWeight: 'bold'
  },
  accountDetails: {
    paddingBottom: '8px'
  },
  link_container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: '0',
    width: '75px',
    height: '75px',
    fontSize: 'xx-large',
    ':hover': {
      backgroundColor: 'grey'
    }
  }
});
