import React, { useState, useEffect } from "react";
import { apiBiblioteca } from "../api/server";
import Menu from "../components/Menu";
import InputMask from 'react-input-mask';

export function Loans() {
  const [content, setContent] = useState(<LoanList showForm={showForm} />);

  function showList() {
    setContent(<LoanList showForm={showForm} />);
  }

  function showForm(loan) {
    setContent(<LoanForm loan={loan} showList={showList} />);
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

function LoanList(props) {
  const [loans, setLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLoans();
  }, [searchTerm]);


  function fetchLoans() {
    apiBiblioteca.get(`/loans`)
      .then((response) => {
        let data = response.data;
        if (searchTerm) {
          data = data.filter((loan) => {
            return (
              loan.nomeLeitor.toLowerCase().includes(searchTerm.toLowerCase()) ||
              loan.nomeLivro.toLowerCase().includes(searchTerm.toLowerCase()) ||
              loan.cpf.includes(searchTerm) ||
              loan.idLivro.includes(searchTerm) ||
              loan.id === parseInt(searchTerm)
            );
          });
        }
        setLoans(data);
      })
      .catch((error) => console.error(error));
  }

  function deleteLoan(id) {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar este empréstimo?");
    if (confirmDelete) 
    {
      apiBiblioteca.delete(`/loans/${id}`)
      .then((response) => {
        if (!response.ok) {
          fetchLoans();
        } else {
          throw new Error("Unexpected Server Response");
        }
      })
      .catch((error) => console.error(error));
    }
  }

  return (
    <>
      <h2 className="text-center mb-3">Lista de Empréstimos</h2>
      <button onClick={() => props.showForm({})} className="btn btn-primary me-2" type="button">
        + Empréstimo
      </button>
      <br />
      <br />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Digite para pesquisar um empréstimo..."
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
            <th>Data do Empréstimo</th>
            <th>Previsão da Devolução</th>
            <th>Status da Devolução</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {
            loans.map((loan, index) => {
              return (
                <tr key={index}>
                  <td>{loan.id}</td>
                  <td>{loan.cpf}</td>
                  <td>{loan.nomeLeitor.slice(0, 10)}{loan.nomeLeitor.length > 10 ? '...' : ''}</td> 
                  <td>{loan.nomeLivro.slice(0, 10)}{loan.nomeLivro.length > 10 ? '...' : ''}</td> 
                  <td>{loan.dataEmp}</td>
                  <td>{loan.dataDev}</td>
                  <td>{loan.statusEmp}</td>
                  <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                    <button
                      onClick={() => deleteLoan(loan.id)}
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

function LoanForm(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [newLoan, setNewLoan] = useState(props.loan ? props.loan : {
    cpf: '',
    idLivro: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewLoan({ ...newLoan, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    const { cpf, idLivro } = newLoan;
    if (!cpf || !idLivro) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios!");
      return;
    }
    if (props.loan && props.loan.id) {
      updateLoan(props.loan.id, newLoan);
    } else {
      createLoan(newLoan);
    }
  };

  const createLoan = (loan) => {
    const { cpf, idLivro } = loan;
    const idLivroNumero = parseInt(idLivro, 10);

    let reader; 

    apiBiblioteca.get(`/readers`)
      .then((response) => {
        const readers = response.data;
        reader = readers.find((existingReader) => existingReader.cpf === cpf);

        if (!reader) {
          throw new Error('CPF não foi encontrado no banco de leitores!');
        }

        return apiBiblioteca.get(`/books`);
      })
      .then((response) => {
        const books = response.data;
        const book = books.find((existingBook) => existingBook.id === idLivroNumero);

        if (!book) {
          throw new Error('Livro não foi encontrado no banco de dados!');
        }

        const readerAge = calculateAge(reader.dataNasc);

        if (readerAge < book.classificacaoIdade) {
          throw new Error('O leitor não tem idade suficiente para emprestar este livro!');
        }

        alert('Empréstimo realizado com sucesso!');
        window.location.reload();
        return apiBiblioteca.post(`/loans`, loan);


      })
      .then((response) => {
        setErrorMessage(null);
        setNewLoan({
          cpf: "",
          idLivro: "",
        });

      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setErrorMessage('O leitor não tem idade suficiente para emprestar este livro!');
        } else {
          setErrorMessage(error.message);
        }
        console.error(error);
      });
  };

  function calculateAge(birthDate) {
    const today = new Date();
    const birthDateParts = birthDate.split('/');
    const birthYear = birthDateParts[2];
    const birthMonth = birthDateParts[1];
    const birthDay = birthDateParts[0];

    let age = today.getFullYear() - birthYear;
    const m = today.getMonth() - birthMonth;
    if (m < 0 || (m === 0 && today.getDate() < birthDay)) {
      age--;
    }

    return age;
  }

  return (
    <>
      <h2 className="text-center mb-3">
        {props.loan.id ? "Editar Empréstimo" : "Criar Novo Empréstimo"}
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
                <InputMask
                  name="cpf"
                  type="text"
                  className="form-control"
                  defaultValue={props.loan.cpf}
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
                  name="idLivro"
                  type="number"
                  className="form-control"
                  defaultValue={props.loan.idLivro}
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
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Loans;
