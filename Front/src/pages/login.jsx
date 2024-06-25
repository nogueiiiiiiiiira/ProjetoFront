import { useState } from "react";
import axios from "axios";
import style from '../pages/style.module.css';
import NavLinks from "../components/NavLinks";

const Login = () => {
  const [data, setData] = useState({ email: "", senha: "" });
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);

  const handleChange = ({ currentTarget: input }) => {
    setData({...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:3001/login";
      const { data: res } = await axios.post(url, data);
      setToken(res.token);
      localStorage.setItem("token", res.token);
      window.location = "/apiBooks";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
        console.log(error);
        window.alert(`Erro ao logar: login ou senha incorretos!`);
        window.location.reload();
      }
    }
  };

  return (
    <div className={style.login_container}>
      <NavLinks />
        <form className={style.login_form_container} onSubmit={handleSubmit}>
          <h1 className="text-center">Login</h1>
          <br />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            className="form-control mb-3"
            value={data.email}
            required
            style={{
              height: '10%'
            }}
          />

          <input
            type="password"
            placeholder="Senha"
            name="senha"
            onChange={handleChange}
            className="form-control mb-3"
            value={data.senha}
            required
            style={{
              height: '10%'
            }}
            />
          <div className="d-flex justify-content-between align-items-center">
            <div className="form-check">
              <br />
            </div>
          </div>
          <br />
          <br />
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className={style.green_btn}>Login</button>
          <p className="text-center mt-3"><a className={style.firstAcess} href="/PrimeiroAcesso">Não possui uma conta? Cadastre-se!</a></p>
        </form>
    </div>
  );
};

export default Login;