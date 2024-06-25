import React, { useState, useEffect } from "react";
import { apiBiblioteca } from "../api/server";
import InputMask from 'react-input-mask';
import Menu from "../components/Menu";

export function Librarians() {
  const [content, setContent] = useState(<LibrarianList showForm={showForm} />);

  function showList() {
    setContent(<LibrarianList showForm={showForm} />);
  }

  function showForm(librarian) {
    setContent(<LibrarianForm librarian={librarian} showList={showList} />);
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

function LibrarianList(props) {
  const [librarians, setLibrarians] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLibrarians();
  }, [searchTerm]);

  function fetchLibrarians() {
    apiBiblioteca.get(`/librarians`)
      .then((response) => {
        let data = response.data;
        if (searchTerm) {
          data = data.filter((librarian) => {
            return (
              librarian.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
              librarian.cpf.includes(searchTerm) ||
              librarian.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              librarian.telefone.includes(searchTerm) ||
              librarian.id === parseInt(searchTerm)
            );
          });
        }
        setLibrarians(data);
      })
      .catch((error) => console.error(error));
  }

  function deleteLibrarian(id) {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar este bibliotecário?");
    if (confirmDelete) {
      apiBiblioteca.delete(`/librarians/${id}`)
       .then((response) => {
          if (!response.ok) {
            window.location.reload();
          } else {
            setLibrarians(librarians.filter((librarian) => librarian.id!== id));
          }
        })
       .catch((error) => console.error(error));
    }
  }

  return (
    <>
      <h2 className="text-center mb-3">Lista de Bibliotecários</h2>
      <button onClick={() => props.showForm({})} className="btn btn-primary me-2" type="button">
        + Bibliotecário
      </button>
      <br />
      <br />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Digite para pesquisar um bibliotecário..."
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
          {librarians.map((librarian, index) => (
            <tr key={index}>
              <td>{librarian.id}</td>
              <td>{librarian.nome.slice(0, 10)}{librarian.nome.length > 10 ? '...' : ''}</td> 
              <td>{librarian.cpf}</td>
              <td>{librarian.email.slice(0, 10)}{librarian.email.length > 10 ? '...' : ''}</td> 
              <td>{librarian.telefone}</td>
              <td>{librarian.dataNasc}</td>
              <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                <button
                  onClick={() => props.showForm(librarian)}
                  className="btn btn-primary btn-sm me-2"
                  type="button"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteLibrarian(librarian.id)}
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

function LibrarianForm(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [newLibrarian, setNewLibrarian] = useState(
    props.librarian
      ? props.librarian
      : {
          nome: "",
          cpf: "",
          email: "",
          telefone: "",
          dataNasc: "",
          senha: "",
        }
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const formattedValue = name === "dataNasc" ? formatDataNasc(value) : value;
    setNewLibrarian({ ...newLibrarian, [name]: formattedValue });
  };

  const formatDataNasc = (date) => {
    if (date) {
      const [year, month, day] = date.split("-");
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    } else {
      return date;
    }
  };

  const createLibrarian = (librarian) => {
    const confirmCreate = window.confirm("Tem certeza que deseja criar este bibliotecário?");
    if (confirmCreate) {
      apiBiblioteca.get(`/librarians`)
        .then((response) => {
          const librarians = response.data;
          const cpfExistsInLibrarians = librarians.some((existingLibrarian) => existingLibrarian.cpf === librarian.cpf);
          const emailExistsLibrarians = librarians.some((existingLibrarian) => existingLibrarian.email === librarian.email);
          const telefoneExistsInLibrarians = librarians.some((existingLibrarian) => existingLibrarian.telefone === librarian.telefone);
    
          if(cpfExistsInLibrarians){
            setErrorMessage('CPF já existe!');
          }  else if (emailExistsLibrarians) {
            setErrorMessage('Email já existe!');
          } else if (telefoneExistsInLibrarians) {
            setErrorMessage('Telefone já existe!');
          } else {
            apiBiblioteca.post(`/librarians`, librarian)
              .then((response) => {
                setErrorMessage(null);
                setNewLibrarian({
                  nome: "",
                  cpf: "",
                  email: "",
                  telefone: "",
                  dataNasc: "",
                });
                alert("Bibliotecário criado com sucesso!");
                window.location.reload();
              })
              .catch((error) => {
                if (error.response.status === 400) {
                  setErrorMessage('Erro ao criar bibliotecário: dados inválidos');
                } else {
                  setErrorMessage('Erro ao criar bibliotecário!');
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
    const { nome, cpf, email, telefone, dataNasc, senha } = newLibrarian;
    if (!nome || !cpf || !email || !telefone || !dataNasc || !senha) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    if (props.librarian && props.librarian.id) {
      updateLibrarian(props.librarian.id, newLibrarian);
    } else {
      createLibrarian(newLibrarian);
    }
  };

  const updateLibrarian = (id, librarian) => {
    const confirmUpdate = window.confirm("Tem certeza que deseja atualizar este bibliotecário?");
    if (confirmUpdate) {
      apiBiblioteca.get(`/librarians`)
        .then((response) => {
          const librarians = response.data;
          const cpfExistsInLibrarians = librarians.some((existingLibrarian) => existingLibrarian.cpf === librarian.cpf && existingLibrarian.id !== id);
          const emailExistsInLibrarians = librarians.some((existingLibrarian) => existingLibrarian.email === librarian.email && existingLibrarian.id !== id);
          const telefoneExistsInLibrarians = librarians.some((existingLibrarian) => existingLibrarian.telefone === librarian.telefone && existingLibrarian.id !== id);
      
          if(cpfExistsInLibrarians){
            setErrorMessage('CPF já existe!');
          }  else if (emailExistsInLibrarians) {
            setErrorMessage('Email já existe!');
          } else if (telefoneExistsInLibrarians) {
            setErrorMessage('Telefone já existe!');
          } else {
            apiBiblioteca.put(`/librarians/${id}`, librarian)
              .then((response) => {
                setErrorMessage(null);
                alert('Bibliotecário atualizado com sucesso!');
                window.location.reload();
              })
              .catch((error) => {
                setErrorMessage('Erro ao atualizar bibliotecário!');
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
        {props.librarian.id ? "Editar Bibliotecário" : "Criar Novo Bibliotecário"}
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
          <form onSubmit={(event) => handleSubmit(event)}>
            <div className="row">
              <div className="col-sm-8">
                <input
                  name="nome"
                  type="text"
                  className="form-control"
                  defaultValue={props.librarian.nome}
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
                  defaultValue={props.librarian.cpf}
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
                  defaultValue={props.librarian.email}
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
                  defaultValue={props.librarian.telefone}
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

            <div className="row">
              <div className="col-sm-8">
                <input
                  name="senha"
                  type="text"
                  className="form-control"
                  defaultValue={props.librarian.senha}
                  placeholder="Senha"
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

export default Librarians;
