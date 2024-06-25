import React from 'react';
import style from '../pages/sobreNos.module.css'; 
import { FaGraduationCap, FaBook, FaUserTie, FaInstagram } from 'react-icons/fa';
import NavLinks from '../components/NavLinks';

function SobreNos() {
  return (
    <div>
    <div className={style.body}>
        <NavLinks />
        <br />
        <br />
        <h1 className={style.h1}>BIBLIOTECA NOVA</h1>
        <br />
        <br />
        <br />
    <div className={style.container}>
      <div className={style.card}>
        <div className={style.cardIcon}>
        <FaGraduationCap />
        </div>
        <h2 className={style.cardTitle}>HISTÓRIA</h2>
        <p className={style.cardText}>
        Fundada com o objetivo de promover o acesso à cultura para todos os cidadãos da região, a Biblioteca Nova se dedica a ser um centro de aprendizagem para a comunidade local.
        </p>
      </div>
      <div className={style.card}>
        <div className={style.cardIcon}>
        <FaBook />
        </div>
        <h2 className={style.cardTitle}>OBJETIVO</h2>
        <p className={style.cardText}>
          Lidamos com as mais demasiadas obras com o objetivo de distribuir o conhecimento e a cultura de diversos livros para todos os que se interessarem.
        </p>
      </div>
      <div className={style.card}>
        <div className={style.cardIcon}>
        <FaUserTie />
        </div>
        <h2 className={style.cardTitle}>EQUIPE</h2>
        <p className={style.cardText}>
        Nossa equipe é composta por bibliotecários dedicados que se esforçam para promover a leitura e o conhecimento na nossa comunidade.
        </p>
      </div>
    </div>
    <p className={style.p}>Na Biblioteca Nova, oferecemos uma ampla gama de serviços, incluindo empréstimo e devolução de livros, proporcionando acesso a uma riqueza de conhecimento e cultura através de nossa diversificada coleção de livros. Nossos livros abrangem desde clássicos da literatura mundial até obras contemporâneas, promovendo aprendizado, imaginação e reflexão para todas as idades e interesses.</p>
    <br />
    <br />
    <br />
    <br />
    <br />
      <h1 className={style.h1}>COLABORADORES</h1>
      <br />
      <br />
      <br />
      <div className={style.container}>
        <div className={style.card}>
          <div className={style.cardIcon}>
          <img src=".\src\assets\cleber.png" alt="Imagem do fundador" className={style.roundedImage} />
          </div>
          <h2 className={style.cardTitle}>Cleber Leivas</h2>
          <p className={style.cardText}>
            "Os livros são a chave para abrir as portas do conhecimento e da sabedoria."
          </p>
          <div className={style.socialMedia}>
            <a href="https://www.instagram.com/cleberleivas/" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
        <div className={style.card}>
          <div className={style.cardIcon}>
          <img src=".\src\assets\gui.png" alt="Imagem do fundador" className={style.roundedImage} />
          </div>
          <h2 className={style.cardTitle}>Guilherme Araújo</h2>
          <p className={style.cardText}>
            "A leitura é a chave para a liberdade e o crescimento pessoal."
          </p>
          <div className={style.socialMedia}>
            <a href="https://www.instagram.com/gui.araujo07/" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
        <div className={style.card}>
          <div className={style.cardIcon}>
          <img src=".\src\assets\karen.jpg" alt="Imagem do fundador" className={style.roundedImage} />
          </div>
          <h2 className={style.cardTitle}>Karen Nogueira</h2>
          <p className={style.cardText}>
            "Os livros são a minha fonte de inspiração e conhecimento."
          </p>
          <div className={style.socialMedia}>
            <a href="https://www.instagram.com/karenzyxg/" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
        <div className={style.card}>
          <div className={style.cardIcon}>
          <img src=".\src\assets\pablo.png" alt="Imagem do fundador" className={style.roundedImage} />
          </div>
          <h2 className={style.cardTitle}>Pablo</h2>
          <p className={style.cardText}>
            "A leitura é a minha paixão e a minha fonte de conhecimento."
          </p>
          <div className={style.socialMedia}>
            <a href="https://www.instagram.com/pg_verissimo/" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default SobreNos;