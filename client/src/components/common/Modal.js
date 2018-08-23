import React, { Component } from 'react';
import isNil from 'lodash/fp/isNil';

import { StyleSheet, css } from 'aphrodite';

class Modal extends Component {
  constructor() {
    super();
  }

  componentDidMount = () => {
    window.addEventListener('keyup', this.handleKeyUp, false);
    document.addEventListener('click', this.handleOutsideClick, false);
  };

  componentWillUnmount = () => {
    window.removeEventListener('keyup', this.handleKeyUp, false);
    document.removeEventListener('click', this.handleOutsideClick, false);
  };

  handleKeyUp = (event) => {
    const { onCloseRequest } = this.props;
    const keys = {
      27: () => {
        event.preventDefault();
        onCloseRequest();
        window.removeEventListener('keyup', this.handleKeyUp, false);
      }
    };

    if (keys[event.keyCode]) keys[event.keyCode]();
  };

  handleOutsideClick = (event) => {
    const { onCloseRequest } = this.props;

    if (!isNil(this.modal)) {
      if (!this.modal.contains(event.target)) {
        onCloseRequest();
        document.removeEventListener('click', this.handleOutsideClick, false);
      }
    }
  };

  render() {
    const { onCloseRequest, children } = this.props;

    return (
      <div className={css(styles.modalOverlay)}>
        <div className={css(styles.modal)} ref={(node) => (this.modal = node)}>
          <div className={css(styles.modalContent)}>{children}</div>
        </div>
        <input
          type="button"
          value="X"
          className={css(styles.closeButton)}
          onClick={onCloseRequest}
        />
      </div>
    );
  }
}

export default Modal;

const styles = StyleSheet.create({
  body: {
    overflow: 'hidden'
  },
  modalOverlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: '9999',
    opacity: 1,
    overflowX: 'hidden',
    overflowY: 'auto',
    animation: 'show .5s ease'
  },
  modal: {
    width: '450px',
    height: '350px',
    margin: '75px',
    backgroundColor: '#fff',
    boxShadow: [0, 0, '0.625rem', 'rgba(0, 0, 0, 0.2)']
  },
  modalContent: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeButton: {
    position: 'fixed',
    top: 0,
    right: 0,
    background: '#fff',
    width: '2.5rem',
    height: '2.5rem',
    fontSize: '2.0rem',
    fontWeight: '900',
    padding: 0,
    border: 0,
    cursor: 'pointer',
    outline: 0,
    boxShadow: [0, 0, '0.625rem', 'rgba(0, 0, 0, 0.2)']
  }
});
