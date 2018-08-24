import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

class KillSwitch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggled: false
    };
  }

  componentDidMount = () => {
    const { status } = this.props;

    if (status === 'Inactive') {
      this.setState({
        isToggled: true
      });
    }
  };

  handleToggle = async () => {
    const { freezeBounty } = this.props;
    const { isToggled } = this.state;

    let result = await freezeBounty();

    if (result) {
      this.setState({
        isToggled: !isToggled
      });
    }
  };

  render() {
    const { isToggled } = this.state;
    const toggleState = css(
      isToggled ? styles.toggle_active : styles.toggle_inactive
    );
    const buttonState = css(
      isToggled ? styles.button_active : styles.button_inactive
    );

    return (
      <div className={toggleState} onClick={this.handleToggle}>
        <div className={buttonState} />
      </div>
    );
  }
}

export default KillSwitch;

const styles = StyleSheet.create({
  toggle_active: {
    background: '#66CC99',
    borderColor: '#dfdfdf',
    fontSize: '2rem',
    color: '#171717',
    width: '50px',
    height: '20px',
    border: '1px solid #555',
    position: 'relative',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'border-color background-color 0.3s',
    margin: '10px'
  },
  toggle_inactive: {
    fontSize: '2rem',
    color: '#171717',
    width: '50px',
    height: '20px',
    background: '#777777',
    border: '1px solid #555',
    position: 'relative',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'border-color background-color 0.3s',
    margin: '10px'
  },
  button_active: {
    position: 'absolute',
    top: '-3px',
    right: '-2px',
    height: '26px',
    width: '26px',
    background: '#dfdfdf',
    boxShadow: '0 0 5px #555',
    borderRadius: '50%',
    transition: 'right 0.3s'
  },
  button_inactive: {
    position: 'absolute',
    top: '-3px',
    right: '50%',
    height: '26px',
    width: '26px',
    background: '#dfdfdf',
    boxShadow: '0 0 5px #555',
    borderRadius: '50%',
    transition: 'right 0.3s'
  }
});
