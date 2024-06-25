import React, { useState, useEffect } from "react";
import { apiBiblioteca } from "../api/server";
import Menu from "../components/Menu";
import InputMask from 'react-input-mask';

export function Readers() {
  const [content, setContent] = useState(<ReaderList showForm={showForm} />);

  function showList() {
    setContent(<ReaderList showForm={showForm} />);
  }

  function showForm(reader) {
    setContent(<ReaderForm reader={reader} showList={showList} />);
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

function ReaderList(props) {
  const [readers, setReaders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReaders();
  }, [searchTerm]);

  function fetchReaders() {
    apiBiblioteca.get(`/readers`)
     .then((response) => {
        let data = response.data;
        if (searchTerm) {
          data = data.filter((reader) => {
            return (
              reader.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
              reader.cpf.includes(searchTerm) ||
              reader.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              reader.telefone.includes(searchTerm) ||
              reader.id === parseInt(searchTerm)
            );
          });
        }
        setReaders(data);
      })
     .catch((error) => console.error(error));
  }

  function deleteReader(id) {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar este leitor?");
    if (confirmDelete) {
      apiBiblioteca.delete(`/readers/${id}`)
       .then((response) => {
          if (!response.ok) {
            window.location.reload();
          } else {
            setReaders(readers.filter((reader) => reader.id!== id));
          }
        })
       .catch((error) => console.error(error));
    }
  }

  return (
    <>
      <h2 className="text-center mb-3">Lista de Leitores</h2>
      <button onClick={() => props.showForm({})} className="btn btn-primary me-2" type="button">
        + Leitor
      </button>
      <br />
      <br />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Digite para pesquisar um leitor..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <br />
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Data de Nascimento</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {readers.map((reader, index) => (
            <tr key={index}>
              <td>{reader.id}</td>
              <td>{reader.nome.slice(0, 10)}{reader.nome.length > 10 ? '...' : ''}</td> 
              <td>{reader.cpf}</td>
              <td>{reader.email.slice(0, 10)}{reader.email.length > 10 ? '...' : ''}</td> 
              <td>{reader.telefone}</td>
              <td>{reader.dataNasc}</td>
              <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                <button
                  onClick={() => props.showForm(reader)}
                  className="btn btn-primary btn-sm me-2"
                  type="button"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteReader(reader.id)}
                  className="btn btn-danger btn-sm"
                  type="button"
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function ReaderForm(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [newReader, setNewReader] = useState(
    props.reader
     ? props.reader
      : {
          nome: "",
          cpf: "",
          email: "",
          telefone: "",
          dataNasc: "",
        }
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const formattedValue = name === "dataNasc"? formatDataNasc(value) : value;
    setNewReader({...newReader, [name]: formattedValue });
  };

  const formatDataNasc = (date) => {
    if (date) {
      const [year, month, day] = date.split("-");
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    } else {
      return date;
    }
  };

  const createReader = (reader) => {
    const confirmCreate = window.confirm("Tem certeza que deseja criar este leitor?");
    if (confirmCreate) {
      apiBiblioteca.get(`/readers`)
        .then((response) => {
          const readers = response.data;
          const cpfExistsInReaders = readers.some((existingReader) => existingReader.cpf === reader.cpf);
          const emailExistsReaders = readers.some((existingReader) => existingReader.email === reader.email);
          const telefoneExistsInReaders = readers.some((existingReader) => existingReader.telefone === reader.telefone);
    
          if(cpfExistsInReaders){
            setErrorMessage('CPF já existe!');
          }  else if (emailExistsReaders) {
            setErrorMessage('Email já existe!');
          } else if (telefoneExistsInReaders) {
            setErrorMessage('Telefone já existe!');
          } else {
            apiBiblioteca.post(`/readers`, reader)
              .then((response) => {
                setErrorMessage(null);
                setNewReader({
                  nome: "",
                  cpf: "",
                  email: "",
                  telefone: "",
                  dataNasc: "",
                });
                alert("Leitor criado com sucesso!");
                window.location.reload();
              })
              .catch((error) => {
                if (error.response.status === 400) {
                  setErrorMessage('Erro ao criar leitor: dados inválidos');
                } else {
                  setErrorMessage('Erro ao criar leitor!');
                }
                console.error(error);
              });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };  

  const handleSubmit = (event) => {
    event.preventDefault();
    const { nome, cpf, email, telefone, dataNasc } = newReader;
    if (!nome || !cpf || !email || !telefone || !dataNasc ) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    if (props.reader && props.reader.id) {
      updateReader(props.reader.id, newReader);
    } else {
      createReader(newReader);
    }
  };

  const updateReader = (id, reader) => {
    const confirmUpdate = window.confirm("Tem certeza que deseja atualizar este leitor?");
    if (confirmUpdate) {
      apiBiblioteca.get(`/readers`)
        .then((response) => {
          const readers = response.data;
          const cpfExistsInReaders = readers.some((existingReader) => existingReader.cpf === reader.cpf && existingReader.id !== id);
          const emailExistsInReaders = readers.some((existingReader) => existingReader.email === reader.email && existingReader.id !== id);
          const telefoneExistsInReaders = readers.some((existingReader) => existingReader.telefone === reader.telefone && existingReader.id !== id);
        
          if(cpfExistsInReaders){
            setErrorMessage('CPF já existe!');
          }  else if (emailExistsInReaders) {
            setErrorMessage('Email já existe!');
          } else if (telefoneExistsInReaders) {
            setErrorMessage('Telefone já existe!');
          } else {
            apiBiblioteca.put(`/readers/${id}`, reader)
              .then((response) => {
                setErrorMessage(null);
                alert('Leitor atualizado com sucesso!');
                window.location.reload();
              })
              .catch((error) => {
                setErrorMessage('Erro ao atualizar leitor!');
                console.error(error);
              });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };    

  return (
    <>
      <h2 className="text-center mb-3">
        {props.reader.id? "Editar Leitor" : "Criar Novo Leitor"}
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
            <div className="row">
              <div className="col-sm-8">
                <input
                  name="nome"
                  type="text"
                  className="form-control"
                  defaultValue={props.reader.nome}
                  placeholder="Nome"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-8">
                <InputMask
                  name="cpf"
                  type="text"
                  className="form-control"
                  defaultValue={props.reader.cpf}
                  placeholder="CPF"
                  onChange={handleInputChange}
                  mask="999.999.999-99"
                  maskChar="_"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-8">
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  defaultValue={props.reader.email}
                  placeholder="Email"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-8">
                <InputMask
                  name="telefone"
                  type="text"
                  className="form-control"
                  defaultValue={props.reader.telefone}
                  placeholder="Telefone"
                  onChange={handleInputChange}
                  mask="(99) 99999-9999"
                  maskChar="_"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-8">
                <input
                  name="dataNasc"
                  type="text"
                  className="form-control"
                  placeholder="Data de Nascimento"
                  onFocus={(e) => {
                    e.target.type = 'date';
                    e.target.placeholder = '';
                  }}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      e.target.type = 'text';
                      e.target.placeholder = 'Data de Nascimento';
                    }
                  }}
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

export default Readers;