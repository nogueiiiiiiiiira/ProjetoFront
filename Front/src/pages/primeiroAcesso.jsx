import React, { useState } from "react";
import { apiBiblioteca } from "../api/server";
import InputMask from 'react-input-mask';
import { useNavigate } from "react-router-dom";
import style from '../pages/style.module.css';
import NavLinks from "../components/NavLinks";

export function PrimeiroAcesso() {
  const [content] = useState(<CadastroForm />);

  return (
      <div>
        {content}
      </div>
  );
}

function CadastroForm() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [newLibrarian, setNewLibrarian] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    dataNasc: "",
    senha: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const formattedValue = name === "dataNasc"? formatDataNasc(value) : value;
    setNewLibrarian({...newLibrarian, [name]: formattedValue });
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
          const emailExistsInLibrarians = librarians.some((existingLibrarian) => existingLibrarian.email === librarian.email);
          const telefoneExistsInLibrarians = librarians.some((existingLibrarian) => existingLibrarian.telefone === librarian.telefone);
    
          if(cpfExistsInLibrarians){
            setErrorMessage(null);
            alert('CPF já existe!');
          }  else if (emailExistsInLibrarians) {
            setErrorMessage(null);
            alert('Email já existe!');
          } else if (telefoneExistsInLibrarians) {
            setErrorMessage(null)
            alert('Telefone já existe!');
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
                  senha: "",
                });
                alert("Bibliotecário criado com sucesso!");
                navigate("/Login");
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
      setErrorMessage(null);
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }
    createLibrarian(newLibrarian);
  };

  return (
    <div className={style.firstAcess_container}>
      <NavLinks />
      <form className={style.firstAcess_form_container} onSubmit={(event) => handleSubmit(event)}>
        <h1 className="text-center" >Cadastre-se</h1>
        <br />
        <input
            name="nome"
            type="text"
            placeholder="Nome"
            onChange={handleInputChange}
            className="form-control mb-3"
            required
            />

          <InputMask
            name="cpf"
            type="text"
            placeholder="CPF"
            onChange={handleInputChange}
            mask="999.999.999-99"
            maskChar="_"
            className="form-control mb-3"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleInputChange}
            className="form-control mb-3"
            required
          />

          <InputMask
            name="telefone"
            type="text"
            placeholder="Telefone"
            onChange={handleInputChange}
            mask="(99) 99999-9999"
            maskChar="_"
            className="form-control mb-3"
            required
          />

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
          required
          />

          <input
            name="senha"
            type="password"
            placeholder="Senha"
            onChange={handleInputChange}
            className="form-control mb-3"
            required
          />
          <br />
          <br />
          <button type="submit" className={style.green_btn}>Cadastrar</button>
          <p className="text-center mt-3"><a className={style.firstAcess} href="/Login">Já possui uma conta? Faça login!</a></p>
      </form>
    </div>
  );  
}

export default PrimeiroAcesso;