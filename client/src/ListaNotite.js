import React, { Component } from 'react';

export default class ListaNotite extends Component {
  render() {
    return (
      <>
        {this.props.notite.map((notita, index) => {
          let data;
          try {
            data = notita.data.toLocaleDateString();
          } catch (e) {
            data = notita.data.toString().substring(0, 10);
          }
          const stergeNotita = () => {
            if (window.confirm('Doriti sa stergeti aceasta notita?')) {
              fetch(`http://localhost:8080/notite/${notita.id}`, {
                method: 'DELETE',
              }).then((res) => {
                this.props.notite.splice(index, 1);
              });
            }
          };
          const partajeazaNotita = () => {
            const nume = window.prompt('Introdu numele grupului', '');
            if (nume && nume !== '') {
              fetch(`http://localhost:8080/grupuri/notes/${nume}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: notita.id }),
              }).then((res) => {
                if (res.ok) alert('Succes');
                else alert('Eroare');
              });
            }
          };
          return (
            <div
              key={notita.id}
              className="card"
              style={{ width: '18rem', margin: '10px' }}
            >
              <div className="card-body">
                <h5 className="card-title">{notita.titlu}</h5>
                <span>{data}</span>
                <p className="card-text">
                  {notita.text.substring(0, 100) + '...'}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => this.props.deschidere(notita)}
                >
                  Acceseaza
                </button>
                <button
                  style={{ marginLeft: '30px' }}
                  className="btn btn-danger"
                  onClick={stergeNotita}
                >
                  Sterge
                </button>
                {this.props.poateTrimite && (
                  <div style={{ margin: '10px' }}>
                    <button
                      className="btn btn-primary"
                      onClick={partajeazaNotita}
                    >
                      Trimite unui grup
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </>
    );
  }
}
