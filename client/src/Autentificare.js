import React, { Component } from 'react';

export default class Autentificare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      newEmail: '',
      newPassword: '',
      nume: '',
    };
  }

  handleLogin(callback) {
    const email = this.state.email;
    const password = this.state.password;
    fetch('http://localhost:8080/studenti/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
      if (res.ok) callback();
      else {
        alert('Credentiale gresite');
      }
    });
  }
  handleRegister() {
    const email = this.state.newEmail;
    const password = this.state.newPassword;
    const name = this.state.nume;
    fetch('http://localhost:8080/studenti', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (res.ok) {
        // this.props.functie();
        this.setState({ newEmail: '', newPassword: '', nume: '' });
        alert('cont nou');
      } else {
        alert('Date gresite');
      }
    });
  }
  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <h2 style={{ marginTop: '100px' }}>Autentificare cu cont existent</h2>
        <div style={{ width: '500px' }}>
          <label>Email:</label>
          <input
            className="form-control"
            value={this.state.email}
            onChange={(e) => this.setState({ email: e.target.value })}
          />
        </div>
        <div style={{ width: '500px' }}>
          <label>Parola:</label>
          <input
            className="form-control"
            type={'password'}
            value={this.state.password}
            onChange={(e) => this.setState({ password: e.target.value })}
          />
        </div>
        <button
          className="btn btn-primary"
          style={{ marginTop: '10px' }}
          onClick={() => this.handleLogin(this.props.functie)}
        >
          Autentificare
        </button>
        <h2 style={{ marginTop: '100px' }}>Inregistrare cu un cont nou</h2>
        <div style={{ width: '500px' }}>
          <label>Nume:</label>
          <input
            className="form-control"
            value={this.state.nume}
            onChange={(e) => this.setState({ nume: e.target.value })}
          />
        </div>
        <div style={{ width: '500px' }}>
          <label>Email:</label>
          <input
            className="form-control"
            value={this.state.newEmail}
            onChange={(e) => this.setState({ newEmail: e.target.value })}
          />
        </div>
        <div style={{ width: '500px' }}>
          <label>Parola:</label>
          <input
            className="form-control"
            type={'password'}
            value={this.state.newPassword}
            onChange={(e) => this.setState({ newPassword: e.target.value })}
          />
        </div>
        <button
          className="btn btn-primary"
          style={{ marginTop: '10px' }}
          onClick={() => this.handleRegister()}
        >
          Inregistrare
        </button>
      </div>
    );
  }
}
