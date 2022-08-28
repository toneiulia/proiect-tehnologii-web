import React, { Component } from 'react';
import ListaNotite from './ListaNotite';

export default class Materie extends Component {
  render() {
    return (
      <div>
        <h2 className="d-flex justify-content-center list-group-item-secondary">
          {this.props.nume}
        </h2>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          <ListaNotite
            notite={this.props.notite}
            poateTrimite={true}
            deschidere={this.props.deschidere}
          />
          <div
            style={{ display: 'flex', minHeight: '100%', alignItems: 'center' }}
          >
            <button
              className="btn btn-secondary"
              onClick={() =>
                this.props.deschidere({ materieId: this.props.idMaterie })
              }
            >
              Adauga
            </button>
          </div>
        </div>
      </div>
    );
  }
}
