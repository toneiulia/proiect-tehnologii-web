import React, { Component } from 'react';
import Grup from './Grup';
import Materie from './Materie';

export default class Materii extends Component {
  fetchGrupuri = () => {
    fetch('http://localhost:8080/grupuri/membru')
      .then((res) => res.json())
      .then((data) => {
        this.setState({ grupuri: data });
      });
  };
  fetchStudenti = () => {
    fetch('http://localhost:8080/studenti')
      .then((res) => res.json())
      .then((data) => this.setState({ studenti: data }));
  };
  stergeGrup = (id) => {
    let vector = this.state.grupuri;
    vector = vector.filter((elem) => elem.id !== id);
    this.setState({ grupuri: vector });
  };
  constructor(props) {
    super(props);
    this.state = {
      materii: [],
      loaded: false,
      grupuri: [],
      studenti: [],
    };
    this.fetchGrupuri();
    this.fetchStudenti();
  }
  creazaGrup = () => {
    const nume = window.prompt('Numele grupului', '');
    if (nume !== '' && nume != null) {
      fetch('http://localhost:8080/grupuri', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nume }),
      }).then((res) => {
        if (res.ok) alert('Grup creat');
        this.fetchGrupuri();
      });
    }
  };
  componentDidMount = async () => {
    let res = await fetch('http://localhost:8080/notite', { method: 'GET' });
    let notite = await res.json();
    res = await fetch('http://localhost:8080/materii', { method: 'GET' });
    const materii = await res.json();
    materii.forEach((materie) => (materie.notite = []));
    materii.forEach((materie) => {
      for (let notita of notite) {
        if (notita.materieId === materie.id) {
          materie.notite.push(notita);
        }
      }
    });
    this.setState({ materii: materii, loaded: true });
  };

  render() {
    if (this.state.loaded)
      return (
        <div style={{ marginBottom: '100px' }}>
          {this.state.materii.map((mat) => {
            return (
              <Materie
                key={mat.id}
                nume={mat.nume}
                notite={mat.notite}
                idMaterie={mat.id}
                deschidere={this.props.deschidere}
              />
            );
          })}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              marginTop: '100px',
            }}
          >
            <h1>Grupuri</h1>
            <button className="btn btn-primary mt-3" onClick={this.creazaGrup}>
              Creeaza
            </button>
            <div style={{ marginBottom: '100px' }}>
              {this.state.grupuri.map((grup) => {
                return (
                  <Grup
                    key={grup.id}
                    grup={grup}
                    sterge={this.stergeGrup}
                    deschidere={this.props.deschidere}
                  />
                );
              })}
            </div>
          </div>
        </div>
      );
    else return null;
  }
}
