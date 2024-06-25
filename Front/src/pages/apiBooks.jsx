import React, { useState, useEffect } from 'react';
import { apiBooks } from "../api/server";
import Card from "../components/Card";
import style from './apiBooks.module.css';
import Menu from '../components/Menu';
import 'bootstrap/dist/css/bootstrap.min.css';

export const ApiBooksComponent = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBooks = async () => {
    try {
      let url = `?q=${searchQuery}`;
      const response = await apiBooks.get(url);
      if (!response.data.items || response.data.items.length === 0) {
        console.log("Nenhum livro encontrado!");
        setData([]);
      } else {
        setData(response.data.items);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          console.log("Livro não encontrado!");
        } else if (error.response.status === 503) {
          console.log("Serviço indisponível!");
        } else {
          console.log(`Erro: ${error.response.statusText}`);
        }
      } else {
        console.error("Erro na requisição:", error);
      }
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchQuery]);

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      fetchBooks();
    }
  };

  return (
    <>
      <Menu />
      <div className={style.wrapBooks}>
        <h1>Busca de Livros na Google Books API</h1>
        <form className="d-flex justify-content-center">
          <input
            type="text"
            className="form-control form-control-lg"
            style={{ width: '50%' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={handleKeyUp}
            placeholder="Pesquise um livro..."
          />
        </form>
        <section className={style.cardsBooks}>
          {data.length > 0? (
            data.map((book) => (
              <Card
                key={book.id}
                title={book.volumeInfo.title}
                desc={book.volumeInfo.description || "Descrição não disponível"}
                value={book.volumeInfo.authors? book.volumeInfo.authors.join(', ') : "Autor desconhecido"}
                imgSrc2={book.volumeInfo.imageLinks? book.volumeInfo.imageLinks.thumbnail : "https://via.placeholder.com/150"}
                id={book.id}
              />
            ))
          ) : (
            <p>Nenhum livro encontrado.</p>
          )}
        </section>
      </div>
    </>
  );
};