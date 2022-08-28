import React, { Component } from 'react';

export default class Navbar extends Component {
  render() {
    return (
      <nav
        className="navbar navbar-dark bg-primary"
        style={{ position: 'relative', height: '60px', textAlign: 'center' }}
      >
        <h3
          style={{
            textAlign: 'center',
            width: '100%',
            color: 'white',
            textDecoration: 'underline',
          }}
        >
          Proiect
        </h3>

        <button
          style={{
            position: 'absolute',
            right: '0',
            marginRight: '10px',
            display: this.props.display ? 'initial' : 'none',
          }}
          className="btn btn-danger"
          onClick={this.props.functie}
        >
          Logout
        </button>
      </nav>
    );
  }
}
