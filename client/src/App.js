import React, { Component } from 'react';
import Autentificare from './Autentificare';
import Materii from './Materii';
import Navbar from './Navbar';
import Notita from './Notita';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoggedIn: false, notita: null };
    fetch('http://localhost:8080/studenti/isloggedin')
      .then((res) => {
        if (res.ok) return res.json();
        else return { eroare: 'nu exista' };
      })
      .then((data) => {
        if (data.ok) this.setState({ isLoggedIn: true });
      });
  }
  render() {
    return (
      <>
        <Navbar
          display={this.state.isLoggedIn}
          functie={() => {
            this.setState({ isLoggedIn: false });
            fetch('http://localhost:8080/studenti/logout').then(function (res) {
              window.location.reload();
            });
          }}
        />
        {!this.state.isLoggedIn && (
          <Autentificare functie={() => this.setState({ isLoggedIn: true })} />
        )}
        {this.state.isLoggedIn && !this.state.notita && (
          <Materii deschidere={(v) => this.setState({ notita: v })} />
        )}
        {this.state.isLoggedIn && this.state.notita && (
          <Notita
            notita={this.state.notita}
            inchide={() => {
              this.setState({ notita: null });
            }}
          />
        )}
      </>
    );
  }
}
