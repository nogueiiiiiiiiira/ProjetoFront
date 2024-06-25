import React from 'react';
import style from '../pages/homePage.module.css';
import NavLinks from '../components/NavLinks';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className={style.container}>
      <NavLinks />
      <h1 className={style.title}>SEJA BEM-VINDO À BIBLIOTECA NOVA</h1>
      <h2 className={style.subtitle}>Somos um grupo que busca disponibilizar conhecimento e cultura para a comunidade</h2>
      <div className={style.buttons}>
        <Link to="/login" className={style.button}>FAÇA LOGIN</Link>
        <Link to="/PrimeiroAcesso" className={style.button}>CADASTRE-SE</Link>
        </div>
    </div>
  );
};

export default HomePage;