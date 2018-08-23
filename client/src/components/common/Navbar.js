import React, { Component } from 'react';
import Identicon from 'identicon.js';

import { StyleSheet, css } from 'aphrodite';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: null,
      icon: null
    };
  }

  componentDidMount = async () => {
    try {
      const { account, web3 } = this.props.data;

      const balance = await web3.eth.getBalance(account);
      const balanceInEther = web3.utils.fromWei(balance, 'ether');
      const balanceRounded = Number.parseFloat(balanceInEther).toPrecision(6);

      const icon = new Identicon(account, 65).toString();

      this.setState({
        balance: balanceRounded,
        icon: icon
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { account } = this.props.data;
    const { balance, icon } = this.state;
    return (
      <div className={css(styles.navbar_container)}>
        <div className={css(styles.rightSide_container)}>
          <div className={css(styles.icon_container)}>
            <img src={`data:image/png;base64,${icon}`} />
          </div>

          <div className={css(styles.accountDetails_container)}>
            <p className={css(styles.accountDetails)}>{account}</p>
            <p className={css(styles.accountDetails)}>{balance} Ξ</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;

const styles = StyleSheet.create({
  navbar_container: {
    display: 'flex',
    justifyContent: 'center',
    width: '800px',
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
  rightSide_container: {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  }
});
