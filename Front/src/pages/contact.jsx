import React, { useState } from 'react';
import style from '../pages/contact.module.css';
import NavLinks from '../components/NavLinks';
import { FaMapMarkerAlt } from 'react-icons/fa';
import apiBiblioteca from '../api/server';
import InputMask from 'react-input-mask';

const ContactForm = () => {
  const [nome, setNome] = useState('');
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [telefone, setTelefone] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nome || !assunto || !mensagem || !telefone) {
      setError('O preenchimento de todos os campos é obrigatório');
      return;
    }
    try {
      await apiBiblioteca.post('/mensagens', {
        nome,
        assunto,
        mensagem,
        telefone,
      });
      setError(null);
      clearForm(); 
    } catch (error) {
      setError(error.response.data.message); 
      setSuccess(null);
    }

    alert('Mensagem enviada com sucesso!');

  };

  const clearForm = () => {
    setNome('');
    setAssunto('');
    setMensagem('');
    setTelefone('');
  };

  return (
    <div className={style.contact}>
      <NavLinks />
      <div className={style.row}>
        <div className={style.contactForm}>
          <h2>Vamos entrar em contato?</h2>
          <br />
          <p>Estamos abertos à sugestões e critícas</p>
          <address>
            <FaMapMarkerAlt /><span> </span>Rua Paula Gomes 270, Curitiba, PR, 80510-070. Paraná, Curitiba
          </address>
        </div>
        <div className={style.contactForm2}>
          <h2>Entre em contato</h2>
          <br />
          <form onSubmit={handleSubmit}>
            <label>
              NOME COMPLETO
              <input
                type="text"
                name="fullName"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
              />
            </label>
            <label>
              ASSUNTO
              <input
                type="text"
                name="subject"
                value={assunto}
                onChange={(event) => setAssunto(event.target.value)}
                required
              />
            </label>
            <label>
              MENSAGEM
              <br />
              <br />
              <textarea
                name="message"
                value={mensagem}
                onChange={(event) => setMensagem(event.target.value)}
                required
              />
            </label>
            <label>
              TELEFONE
              <InputMask
                  name="telefone"
                  type="text"
                  value={telefone}
                  onChange={(event) => setTelefone(event.target.value)}
                  required
                  mask="(99) 99999-9999"
                  maskChar="_"
                />
            </label>
            <button type="submit">Mandar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;