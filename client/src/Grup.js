import React, { Component } from 'react';
import ListaNotite from './ListaNotite';

export default class Grup extends Component {
  constructor(props) {
    super(props);
    this.state = { showInput: false, adrese: '', membri: [], notite: [] };
    this.stergeGrup = this.stergeGrup.bind(this);
    this.adaugaParticipanti = this.adaugaParticipanti.bind(this);
    fetch(`http://localhost:8080/grupuri/${this.props.grup.id}/studenti`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ membri: data.map((elem) => elem.email) });
      });
    fetch(`http://localhost:8080/grupuri/${this.props.grup.id}/notite`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ notite: data });
      });
  }
  adaugaParticipanti() {
    this.setState({ showInput: false });
    const adrese = this.state.adrese.split(',');
    for (let adresa of adrese) {
      fetch(`http://localhost:8080/studenti/${adresa}`)
        .then((res) => res.json())
        .then((data) => {
          fetch(`http://localhost:8080/grupuri/student/${this.props.grup.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: data.id }),
          }).then((res) => {
            if (!res.ok) alert('Nu a reusit');
            else alert('Utilizator adaugat');
          });
        });
    }
  }
  stergeGrup(id) {
    fetch(`http://localhost:8080/grupuri/${id}`, { method: 'delete' }).then(
      (res) => {
        this.props.sterge(id);
        alert('Grup sters');
      }
    );
  }
  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          minWidth: '400px',
        }}
      >
        <h3
          className="mt-3"
          style={{
            borderRadius: '20px',
            borderStyle: 'solid',
            padding: '10px',
          }}
        >
          {this.props.grup.nume}
        </h3>
        {this.props.grup.canEdit && (
          <>
            <button
              className="btn btn-primary"
              style={{ marginTop: '20px' }}
              onClick={() => this.setState({ showInput: true })}
            >
              Adauga participanti
            </button>
            <button
              className="btn btn-danger"
              style={{ marginTop: '20px' }}
              onClick={() => this.stergeGrup(this.props.grup.id)}
            >
              Sterge
            </button>
            {this.state.showInput && (
              <>
                <label style={{ marginTop: '20px' }}>
                  Adrese de email participanti:
                </label>
                <div>
                  <input
                    className="form-control"
                    style={{ display: 'inline', width: '300px' }}
                    type="text"
                    value={this.state.adrese}
                    onChange={(e) => this.setState({ adrese: e.target.value })}
                    placeholder="Adrese separate prin virgula"
                  />

                  <button
                    className="btn btn-primary"
                    onClick={this.adaugaParticipanti}
                  >
                    Adauga
                  </button>
                </div>
              </>
            )}
          </>
        )}
        <p style={{ marginTop: '20px' }}>
          {`Participanti: ${this.state.membri.join(',')}`}
        </p>
        <p style={{ marginTop: '20px' }}>Notite:</p>
        <ListaNotite
          notite={this.state.notite}
          deschidere={this.props.deschidere}
        />
      </div>
    );
  }
}
