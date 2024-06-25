import React, { useState, useEffect } from "react";
import { apiBiblioteca } from "../api/server";
import Menu from "../components/Menu";
import InputMask from 'react-input-mask';

export function Rets() {
  const [content, setContent] = useState(<RetList showForm={showForm} />);

  function showList() {
    setContent(<RetList showForm={showForm} />);
  }

  function showForm(ret) {
    setContent(<RetForm ret={ret} showList={showList} />);
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

function RetList(props) {
  const [rets, setRets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRets();
  }, [searchTerm]);

  function fetchRets() {
    apiBiblioteca.get(`/returns`)
      .then((response) => {
        let data = response.data;
        if (searchTerm) {
          data = data.filter((ret) => {
            return (
              ret.nomeLeitor.toLowerCase().includes(searchTerm.toLowerCase()) ||
              ret.nomeLivro.toLowerCase().includes(searchTerm.toLowerCase()) ||
              ret.cpf.includes(searchTerm) ||
              ret.id === parseInt(searchTerm)
            );
          });
        }
        setRets(data);
      })
      .catch((error) => console.error(error));
  }

  function deleteRet(id) {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar esta devolução?");
    if (confirmDelete) {
    apiBiblioteca.delete(`/returns/${id}`)
      .then((response) => {
        if (!response.ok) {
          fetchRets();
        } else {
          throw new Error("Unexpected Server Response");
        }
      })
      .catch((error) => console.error(error));
      window.location.reload();
  }
}

  return (
    <>
      <h2 className="text-center mb-3">Lista de Devoluções</h2>
      <button onClick={() => props.showForm({})} className="btn btn-primary me-2" type="button">
        + Devolução
      </button>
      <br />
      <br />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Digite para pesquisar uma devolução..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <br />
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>CPF do Leitor</th>
            <th>Nome do Leitor</th>
            <th>Nome do Livro</th>
            <th>Previsão da Devolução</th>
            <th>Data da Devolução</th>
            <th>Multa Atribuída (?) </th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {
            rets.map((ret, index) => {
              return (
                <tr key={index}>
                  <td>{ret.id}</td>
                  <td>{ret.cpf}</td>
                  <td>{ret.nomeLeitor.slice(0, 10)}{ret.nomeLeitor.length > 10 ? '...' : ''}</td> 
                  <td>{ret.nomeLivro.slice(0, 10)}{ret.nomeLivro.length > 10 ? '...' : ''}</td> 
                  <td>{ret.prevDev}</td>
                  <td>{ret.dataAtual}</td>
                  <td>{ret.multaAtribuida}</td>
                  <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                    <button
                      onClick={() => deleteRet(ret.id)}
                      className="btn btn-danger btn-sm"
                      type="button"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
}

function RetForm(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [newRet, setNewRet] = useState(props.ret ? props.ret : {
    cpf: '',
    idLivro: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewRet({ ...newRet, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    const { cpf, idLivro } = newRet;
    if (!cpf || !idLivro) {
      setErrorMessage("Please, provide all the required fields!");
      return;
    }
    if (props.ret && props.ret.id) {
      updateRet(props.ret.id, newRet);
    } else {
      createRet(newRet);
    }
  };

  const createRet = (ret) => {
    const confirmCreate = window.confirm("Tem certeza que deseja realizar esta devolução?");
    if (confirmCreate) {
      apiBiblioteca.get(`/readers`)
        .then((response) => {
          const readers = response.data;
          const cpfExistsInReaders = readers.some((existingReader) => existingReader.cpf === ret.cpf);
  
          if (!cpfExistsInReaders) {
            setErrorMessage('CPF não foi encontrado no banco de leitores!');
            return;
          }
  
          const idLivroNumero = parseInt(ret.idLivro, 10);
  
          apiBiblioteca.get(`/books`)
            .then((response) => {
              const books = response.data;
              const idExistsInBooks = books.some((existingBook) => existingBook.id === idLivroNumero);
  
              if (!idExistsInBooks) {
                setErrorMessage('Livro não foi encontrado no banco de dados!');
                return;
              }
  
              apiBiblioteca.post(`/returns`, ret)
                .then((response) => {
                  setErrorMessage(null);
                  setNewRet({
                    cpf: "",
                    idLivro: "",
                  });
                  
                })
                .catch((error) => {
                  if (error.response && error.response.status === 400) {
                    setErrorMessage('Erro ao realizar a devolução!');
                  } 
              
                  console.error(error);
                  alert('Devolução realizada com sucesso!');
                  window.location.reload();
                  
                });
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  

  const updateRet = (id, ret) => {
    apiBiblioteca.put(`/returns/${id}`, ret)
      .then((response) => {
        setErrorMessage(null);
        alert('Devolução atualizada com sucesso!');
      })
      .catch((error) => {
        setErrorMessage('Erro ao atualizar devolução!');
        console.error(error);
      });
    window.location.reload();
  };

  return (
    <>
      <h2 className="text-center mb-3">
        {props.ret.id ? "Editar Devolução" : "Criar Nova Devolução"}
      </h2>
      <div className="row">
        <div className="col-lg-6 mx-auto">
          {errorMessage && (
            <div className="alert alert-warning" role="alert">
              {errorMessage}
            </div>
          )}
          <br />
          <form onSubmit={(event) => handleSubmit(event)}>
            <div className="row mb-3">
              <div className="col-sm-8">
                <InputMask
                  name="cpf"
                  type="text"
                  className="form-control"
                  defaultValue={props.ret.cpf}
                  placeholder="CPF"
                  onChange={handleInputChange}
                  mask="999.999.999-99"
                  maskChar="_"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-sm-8">
                <input
                  name="idLivro"
                  type="number"
                  className="form-control"
                  defaultValue={props.ret.idLivro}
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

export default Rets;