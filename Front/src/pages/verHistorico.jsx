// Historico.js
import React, { useState, useEffect } from "react";
import apiBiblioteca from "../api/server";
import Menu from "../components/Menu";

export function Historico() {
  const [content, setContent] = useState(<HistoricoList showForm={showForm} />);

  function showList() {
    setContent(<HistoricoList showForm={showForm} />);
  }

  function showForm(historico) {
    setContent(<HistoricoForm historico={historico} showList={showList} />);
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

function HistoricoList(props) {
    const [historicos, setHistorico] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredHistoricos, setFilteredHistoricos] = useState([]);
  
    useEffect(() => {
      fetchHistorico();
    }, []);
  
    function fetchHistorico() {
      apiBiblioteca.get(`/historicos`)
        .then((response) => {
          const data = response.data;
          data.sort((a, b) => a.id - b.id);
          setHistorico(data);
          setFilteredHistoricos(data.reverse());
        })
        .catch((error) => console.error(error));
    }
  
    useEffect(() => {
      if (searchTerm) {
        const filtered = historicos.filter((historico) => {
          return (
            historico.acao.toLowerCase().includes(searchTerm.toLowerCase()) ||
            historico.criadoEm.includes(searchTerm) ||
            historico.id === parseInt(searchTerm)
          );
        });
        setFilteredHistoricos(filtered);
      } else {
        setFilteredHistoricos(historicos);
      }
    }, [searchTerm, historicos]);
  
    return (
      <>
        <h2 className="text-center mb-3">Histórico</h2>
        <br />
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Digite para pesquisar um histórico..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <br />
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ação</th>
              <th>Criado Em</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistoricos.map((historico, index) => (
              <tr key={index}>
                <td>{historico.id}</td>
                <td>{historico.acao}</td>
                <td>{historico.criadoEm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }

export default Historico;