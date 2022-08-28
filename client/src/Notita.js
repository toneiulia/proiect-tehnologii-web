import React, { Component } from 'react';

export default class Notita extends Component {
  constructor(props) {
    super(props);
    delete this.props.notita.data;
    if (!this.props.notita.titlu) this.props.notita.titlu = '';
    this.state = { data: new Date(), ...this.props.notita };
  }
  salveaza = () => {
    //salveaza
    if (this.props.notita?.id) {
      fetch(`http://localhost:8080/notite/${this.props.notita.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state),
      }).then((res) => this.props.inchide());
    } else {
      fetch(`http://localhost:8080/notite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state),
      }).then((res) => this.props.inchide());
    }
  };
  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          marginTop: '20px',
        }}
      >
        <div style={{ margin: '20px' }}>
          <input
            style={{ width: '900px', height: '50px' }}
            value={this.state.titlu}
            onChange={(e) => this.setState({ titlu: e.target.value })}
            placeholder="titlu"
          ></input>
        </div>
        <div style={{ margin: '20px' }}>
          <textarea
            style={{ width: '900px', height: '500px' }}
            value={this.state.text}
            onChange={(e) => this.setState({ text: e.target.value })}
          ></textarea>
        </div>
        <h3>Resurse</h3>
        <div style={{ margin: '20px' }}>
          <textarea
            style={{
              width: '900px',
              height: '150px',
              textDecoration: 'underline',
              color: 'blue',
            }}
            value={this.state.resurse}
            onChange={(e) => this.setState({ resurse: e.target.value })}
          ></textarea>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            width: '900px',
            marginBottom: '20px',
          }}
        >
          <button className="btn btn-primary" onClick={this.salveaza}>
            Salveaza
          </button>
          <button className="btn btn-secondary" onClick={this.props.inchide}>
            Inchide
          </button>
        </div>
      </div>
    );
  }
}
