import React, { useState, useEffect } from "react";
import { apiBiblioteca } from "../api/server";
import Menu from "../components/Menu";

export function Fines() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    showList(); 
  }, []);

  function showList() {
    setContent(<FineList showForm={showForm} />);
  }

  function showForm(fine) {
    setContent(<FineForm fine={fine} showList={showList} />);
  }

  useEffect(() => {
    showList();
  }, []);

  return (
    <>
    <Menu /> 
    <div className="container my-5">
      {content}
    </div>
    </>
  );
}

function FineList(props) {
  const [fines, setFines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFines();
  }, [searchTerm]);

  function fetchFines() {
    apiBiblioteca.get(`/fines`)
      .then((response) => {
        let data = response.data;
        if (searchTerm) {
          data = data.filter((fine) => {
            return (
              fine.nomeLeitor.toLowerCase().includes(searchTerm.toLowerCase()) ||
              fine.nomeLivro.toLowerCase().includes(searchTerm.toLowerCase()) ||
              fine.cpf.includes(searchTerm) ||
              fine.idLivro.includes(searchTerm) ||
              fine.id === parseInt(searchTerm)
            );
          });
        }
        setFines(data);
      })
      .catch((error) => console.error(error));
  }

  function deleteFine(id) {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar esta multa?");
    if (confirmDelete) {
    apiBiblioteca.delete(`/fines/${id}`)
    .then((response) => {
        if (!response.ok) {
          fetchFines();
        } else {
          throw new Error("Unexpected Server Response");
        }
      })
    .catch((error) => console.error(error));
  }
}
  return (
    <>
      <h2 className="text-center mb-3">Lista de Multas</h2>
      <br />
      <br />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Digite para pesquisar um bibliotecário..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <br />
      <div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>CPF do Leitor</th>
            <th>Nome do Leitor</th>
            <th>Nome do Livro</th>
            <th>Dias Atrasados</th>
            <th>Total</th>
            <th>Status da Multa</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>         
          {
            fines.map((fine, index) => {
              return (
                <tr key={index}>
                  <td>{fine.id}</td>
                  <td>{fine.cpf}</td>
                  <td>{fine.nomeLeitor.slice(0, 10)}{fine.nomeLeitor.length > 10 ? '...' : ''}</td> 
                  <td>{fine.nomeLivro.slice(0, 10)}{fine.nomeLivro.length > 10 ? '...' : ''}</td> 
                  <td>{fine.diasAtra}</td>
                  <td> R$ {fine.total}</td>
                  <td>{fine.statusPag}</td>
                  <td>
                    {fine.statusPag === 'Multa Paga'? (
                      <span> </span>
                    ) : (
                      <button onClick={() => props.showForm(fine)} className="btn btn-primary btn-sm me-2" type="button">
                        Pagar Multa
                      </button>
                    )}
                    <button onClick={() => deleteFine(fine.id)} className="btn btn-danger btn-sm" type="button">
                      Excluir
                    </button>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
      </div>
    </>
  );
} 

function FineForm(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [cpf, setCpf] = useState(props.fine.cpf || ''); 
  const [idLivro, setIdLivro] = useState(props.fine.idLivro || '');

  function handleInputChange(event) {
    const { name, value } = event.target;
    if (name === "cpf") {
      setCpf(value);
    } else if (name === "idLivro") {
      setIdLivro(value);
    }
  }

  const handlePayFine = async (event) => {
    event.preventDefault();
    try {
      const confirmPay = window.confirm("Tem certeza que deseja pagar esta multa?");
      if (confirmPay) {
      const response = await apiBiblioteca.put('/payFine', {
        cpf: cpf,
        idLivro: idLivro,
      });
      if (response.status === 201) {
        props.showList();
      } else {
        setErrorMessage('Erro ao pagar multa');
      }
    }
    } catch (error) {
      setErrorMessage('Erro ao pagar multa');
    }
;
}

  return (
    <>
    <h2 className="text-center mb-3">
          Pagar Multa
      </h2>
      <br />
    <div className="row">
      <div className="col-lg-6 mx-auto">
        {errorMessage && (
          <div className="alert alert-warning" role="alert">
            {errorMessage}
          </div>
        )}
        <br />
        <form onSubmit={handlePayFine}>
          <div className="row">
            <div className="col-sm-8">
              <input
                name="cpf"
                type="text"
                className="form-control"
                value={cpf}
                placeholder="CPF do Leitor"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-8">
              <input
                name="idLivro"
                type="text"
                className="form-control"
                value={idLivro}
                placeholder="ID do Livro"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-sm-2 d-grid">
              <button className="btn btn-primary" type="submit">
                Salvar
              </button>
            </div>
            <div className="col-sm-2 d-grid">
              <button
                onClick={() => props.showList()}
                className="btn btn-secondary"
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </>
);
}

export default Fines;