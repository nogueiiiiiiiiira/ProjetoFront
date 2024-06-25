import React, { useState, useEffect } from "react";
import { apiBiblioteca } from "../api/server";
import Menu from "../components/Menu";

export function Mensagens() {
  const [content, setContent] = useState(<MensagemList showForm={showForm} />);

  function showList() {
    setContent(<MensagemList showForm={showForm} />);
  }

  function showForm(mensagem) {
    setContent(<MensagemForm mensagem={mensagem} showList={showList} />);
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

function MensagemList(props) {
  const [mensagens, setMensagens] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMensagens();
  }, [searchTerm]);

  function fetchMensagens() {
    apiBiblioteca.get(`/mensagens`)
   .then((response) => {
        let data = response.data;
        if (searchTerm) {
          data = data.filter((reader) => {
            return (
              reader.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
              reader.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
              reader.mensagem.toLowerCase().includes(searchTerm.toLowerCase()) ||
              reader.telefone.includes(searchTerm) ||
              reader.id === parseInt(searchTerm)
            );
          });
        }
        setMensagens(data);
      })
   .catch((error) => console.error(error));
  }

  function deleteMensagem(id) {
    const confirmDelete =window.confirm("Tem certeza que deseja deletar esta mensagem?");
    if (confirmDelete) {
      apiBiblioteca.delete(`/mensagens/${id}`)
       .then(() => {
          setMensagens(mensagens.filter((mensagem) => mensagem.id!== id));
        })
       .catch((error) => console.error(error));
    }
  }

  return (
    <>
      <h2 className="text-center mb-3">Lista de Mensagens</h2>
      <br />
      <br />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Digite para pesquisar uma mensagem..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <br />
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Assunto</th>
            <th>Mensagem</th>
            <th>Telefone</th>
            <th>Status da Mensagem</th>
            <th>Criado Em</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {mensagens.map((mensagem, index) => (
            <tr key={index}>
              <td>{mensagem.id}</td>
              <td>{mensagem.nome}</td>
              <td>{mensagem.assunto.slice(0, 10)}{mensagem.assunto.length > 10 ? '...' : ''}</td>           
              <td>{mensagem.mensagem.slice(0, 10)}{mensagem.mensagem.length > 10 ? '...' : ''}</td>            
              <td>{mensagem.telefone}</td>
              <td>{mensagem.statusMensagem}</td>
              <td>{mensagem.criadoEm}</td>
              <td>
              {mensagem.statusMensagem === 'Mensagem respondida'? (
                      <span> </span>
                    ) : (
                      <button 
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => props.showForm(mensagem)}
                      type="button">
                    Responder
                    </button>
                    )}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteMensagem(mensagem.id)}
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

function MensagemForm(props) {
  const [telefone, setTelefone] = useState(props.mensagem.telefone);
  const [mensagem, setMensagem] = useState('');
  const [originalMensagem, setOriginalMensagem] = useState(props.mensagem.mensagem);

  const handleSubmit = (event) => {
    event.preventDefault();
    const confirmSend = window.confirm(`Tem certeza que deseja enviar a mensagem para ${telefone}?`);
    if (confirmSend) {
      const token = localStorage.getItem('token'); 
      apiBiblioteca.post('/respostas', {
        mensagem: mensagem,
        telefoneLeitor: telefone
      }, {
        headers: {
          'x-access-token': token
        }
      })
     .then(response => {
        console.log(response.data);
        alert("Mensagem enviada com sucesso!");
      })
     .catch(error => {
        console.error(error);
        console.log(mensagem, telefone)
        alert("Erro ao enviar mensagem!");
      });
    }
  };

  return (
    <>
      <h2 className="text-center mb-3">Responder Mensagem</h2>
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-sm-8">
            <input
              type="text"
              name="telefone"
              className="form-control"
              value={telefone}
              readOnly
              style={{
                width: '50%',
                marginLeft: '11.5vw'
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-8">
            <textarea
              className="form-control"
              value={originalMensagem}
              readOnly
              style={{
                width: '50%',
                marginLeft: '11.5vw'
              }}
            />
            <br />
            <textarea
              className="form-control"
              value={mensagem}
              onChange={(event) => setMensagem(event.target.value)}
              style={{
                width: '50%',
                marginLeft: '11.5vw'
              }}
            />
          </div>
        </div>
        <br />
        <br />
        <div className="row" style={{
          marginLeft: '10vw'
        }}>
          <div className="col-sm-4">
            <button type="submit" className="btn btn-primary mx-2">
              Enviar
            </button>
            <button
              onClick={() => props.showList()}
              className="btn btn-secondary mx-2"
              type="button"
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default Mensagens;