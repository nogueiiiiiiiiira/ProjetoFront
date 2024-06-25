import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './index.css';

import { ApiBooksComponent } from "./pages/apiBooks";
import Books from "./pages/books";
import Readers from "./pages/readers";
import Rets from "./pages/returns";
import Librarians from "./pages/librarians";
import Loans from "./pages/loans";
import Fines from "./pages/fines";
import Login from "./pages/login"; 
import PrimeiroAcesso from "./pages/primeiroAcesso";
import SobreNos from "./pages/sobreNos";
import HomePage from "./pages/homePage";
import Contact from "./pages/contact";
import Mensagens from "./pages/verMensagens.jsx";
import Historico from "./pages/verHistorico.jsx";


const router = createBrowserRouter([
  { path: "/apiBooks", element: <ApiBooksComponent /> },
  { path: "/Books", element: <Books /> },
  { path: "/Readers", element: <Readers /> },
  { path: "/Returns", element: <Rets /> },
  { path: "/Librarians", element: <Librarians />},
  { path: "/Loans", element: <Loans />},
  { path: "/Fines", element: <Fines />},
  { path: "/Login", element: <Login />},
  { path: "/PrimeiroAcesso", element: <PrimeiroAcesso />},
  { path: "/SobreNos", element: <SobreNos />},
  { path: "/", element: <HomePage />},
  { path: "/contatos", element: <Contact />},
  { path: "/mensagens", element: <Mensagens />},
  { path: "/historico", element: <Historico />},

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
