import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Store from './store';
import { Provider } from 'react-redux'

import './index.css';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { Perfil } from './pages/perfil';
import { Register } from './pages/register';
import { Anuncios } from './pages/anuncios';
import { CriarAnuncio } from './pages/anuncios/criar-anuncio';
import { CandidatarAnuncio } from './pages/anuncios/candidatar-anuncio';
import { InfoAnuncio } from './pages/anuncios/info-anuncio';
import { Servicos } from './pages/servicos';
import { InfoServico } from './pages/servicos/info-servico';
import { Mensagens } from './pages/mensagens';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={Store}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil/:UtilizadorID" element={<Perfil />} />
        <Route path="/anuncios" element={<Anuncios />} />
        <Route path="/anuncios/:categoria" element={<Anuncios />} />
        <Route path="/criar-anuncio" element={<CriarAnuncio />} />
        <Route path="/candidatar-anuncio/:anuncioID" element={<CandidatarAnuncio />} />
        <Route path="/info-anuncio/:anuncioID" element={<InfoAnuncio />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/info-servico/:anuncioID" element={<InfoServico />} />
        <Route path="/mensagens" element={<Mensagens />} />
      </Routes>
    </Provider>
  </BrowserRouter>
);