import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

export function Menu() { 
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid justify-content-center">
        <Link className="navbar-brand" to="/apiBooks">
          <img
            src="./src/assets/livros.png"
            alt=""
            className="me-2"
            style={{ height: '35px', width: 'auto' }}
          />
          Biblioteca Nova
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/librarians">
                Bibliotecários
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/books">
                Livros
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/readers">
                Leitores
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/loans">
                Empréstimos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/returns">
                Devoluções
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/fines">
                Multas
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Configurações
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li>
                  <Link className="dropdown-item" to="/mensagens">
                    Ver Mensagens
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/historico">
                    Ver Histórico
                  </Link>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (window.confirm("Deseja realmente sair?")) {
                        window.location.href = "/";
                      }
                    }}
                  >
                    Sair
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Menu;