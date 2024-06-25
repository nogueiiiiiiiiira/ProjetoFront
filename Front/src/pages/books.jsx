import React, { useState, useEffect } from "react";
import { apiBiblioteca } from "../api/server";
import Menu from "../components/Menu";

export function Books() {
  const [content, setContent] = useState(<BookList showForm={showForm} />);

  function showList() {
    setContent(<BookList showForm={showForm} />);
  }

  function showForm(book) {
    setContent(<BookForm book={book} showList={showList} />);
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

function BookList(props) {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBooks();
  }, [searchTerm]);

  function fetchBooks() {
    apiBiblioteca.get(`/books`)
      .then((response) => {
        let data = response.data;
        if (searchTerm) {
          data = data.filter((book) => {
            return (
              book.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
              book.autor.includes(searchTerm) ||
              book.categoria.includes(searchTerm) ||
              book.descricao.includes(searchTerm) ||
              book.id === parseInt(searchTerm)
            );
          });
        }
        setBooks(data);
      })
      .catch((error) => console.error(error));
  }
  
  function deleteBook(id) {
    const confirmDelete = window.confirm("Tem certeza que deseja deletar este livro?");
    if (confirmDelete) {apiBiblioteca.delete(`/books/${id}`)
     .then((response) => {
        if (!response.ok) {
          fetchBooks();
        } else {
          throw new Error("Unexpected Server Response");
        }
      })
     .catch((error) => console.error(error)); 
    }
  }

  return (
    <>
      <h2 className="text-center mb-3">Lista de Livros</h2>
      <button onClick={() => props.showForm({})} className="btn btn-primary me-2" type="button">
        + Livro
      </button>
      <br />
      <br />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Digite para pesquisar um livro..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <br />
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Estoque</th>
            <th>Classificação</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {
          books.map((book, index) => {
            return (
              <tr key={index}>
                <td>{book.id}</td>
                <td>{book.nome.slice(0, 10)}{book.nome.length > 10 ? '...' : ''}</td> 
                <td>{book.autor.slice(0, 10)}{book.autor.length > 10 ? '...' : ''}</td> 
                <td>{book.descricao.slice(0, 10)}{book.descricao.length > 10 ? '...' : ''}</td> 
                <td>{book.categoria}</td>
                <td>{book.estoque}</td>
                <td>{book.classificacaoIdade} anos</td>
                <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                  <button
                    onClick={() => props.showForm(book)}
                    className="btn btn-primary btn-sm me-2"
                    type="button"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteBook(book.id)}
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

function BookForm(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [newBook, setNewBook] = useState(props.book? props.book : {
    nome: '',
    autor: '',
    descricao: '',
    categoria: '',
    estoque: '',
    classificacaoIdade: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewBook({...newBook, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { nome, autor, descricao, categoria, estoque, classificacaoIdade } = newBook;
    if (!nome || !autor || !descricao || !categoria || !estoque || !classificacaoIdade) {
      setErrorMessage("Please, provide all the required fields!");
      return;
    }
    if (props.book.id) {
      updateBook(props.book.id, newBook);
    } else {
      createBook(newBook);
    }
  };

  const createBook = (book) => {
    const confirmCreate = window.confirm("Tem certeza que deseja criar este livro?");
    if (confirmCreate)
    {apiBiblioteca.get(`/books`)
      .then((response) => {
        const existingBook = response.data.find((existingBook) => {
          return (
            existingBook.nome === book.nome &&
            existingBook.autor === book.autor &&
            existingBook.categoria === book.categoria
          );
        });
  
        if (existingBook) {
          existingBook.estoque = (parseInt(existingBook.estoque) + parseInt(book.estoque)).toString();
          updateBook(existingBook.id, existingBook);
          

        } else {
          apiBiblioteca.post(`/books`, book)
            .then((response) => {
              setErrorMessage(null);
              setNewBook({
                nome: '',
                autor: '',
                descricao: '',
                categoria: '',
                estoque: '',
                classificacaoIdade: '',
              });
              alert('Livro criado com sucesso!');
              window.location.reload();
            })
            .catch((error) => {
              setErrorMessage('Erro ao criar livro!');
              console.error(error);
            });
        }
      })
      .catch((error) => console.error(error));
  }
};

  const updateBook = (id, book) => {
    const confirmUpdate = window.confirm("Tem certeza que deseja atualizar este livro?");
    if (confirmUpdate) {
      apiBiblioteca.put(`/books/${id}`, book)
      .then((response) => {
        setErrorMessage(null);
        alert('Livro atualizado com sucesso!');
        window.location.reload();
      })
      .catch((error) => {
        setErrorMessage('Erro ao atualizar livro!');
        console.error(error);
      });
  }
};


  return (
    <>
      <h2 className="text-center mb-3">
        {props.book.id? "Editar Livro" : "Criar Novo Livro"}
      </h2>
      <div className="row">
        <div className="col-lg-6 mx-auto">
          {errorMessage && (
            <div class="alert alert-warning" role="alert">
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
                  defaultValue={props.book.nome}
                  placeholder="Título"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-8">
                <input
                  name="autor"
                  type="text"
                  className="form-control"
                  defaultValue={props.book.autor}
                  placeholder="Autor"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-8">
                <input
                  name="descricao"
                  type="text"
                  className="form-control"
                  defaultValue={props.book.descricao}
                  placeholder="Descrição"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-8">
                <select
                  className="form-select"
                  name="categoria"
                  defaultValue={props.book.categoria}
                  onChange={handleInputChange}
                >
                  <option value="Categoria">Categoria</option>
                  <option value="Autoajuda">Autoajuda</option>
                  <option value="Biografia e Autobiografia">Biografia e Autobiografia</option>
                  <option value="Clássicos">Clássicos</option>
                  <option value="Desenvolvimento Pessoal">Desenvolvimento Pessoal</option>
                  <option value="Distopia">Distopia</option>
                  <option value="Ficção Científica">Ficção Científica</option>
                  <option value="Fantasia">Fantasia</option>
                  <option value="História">História</option>
                  <option value="Juvenil">Juvenil</option>
                  <option value="Poesia">Poesia</option>
                  <option value="Romance">Romance</option>
                  <option value="Suspense e Mistério">Suspense e Mistério</option>
                </select>
              </div>
            </div>
            
            <div className="row">
              <div className="col-sm-8">
                <input
                  name="estoque"
                  type="number"
                  className="form-control"
                  defaultValue={props.book.estoque}
                  placeholder="Estoque"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-8">
                <input
                  name="classificacaoIdade"
                  type="number"
                  className="form-control"
                  defaultValue={props.book.classificacaoIdade}
                  placeholder="Classificação Indicativa"
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

export default Books;   