import { Home } from "./Components/Home";
import { Recipes } from "./Components/Recipes";
import { Recipe } from "./Components/Recipe";
import { Liked } from "./Components/Liked";
import { Upload } from "./Components/Upload";
import { Login } from "./Components/Login";
import { NotFound } from "./Components/NotFound";
import React from 'react';

import { BrowserRouter as Router, Routes,Route } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faCircleUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core";
import { Configure } from "./Components/Configure";

library.add(faMoon, faCircleUser, faBars);

function App() {
  function abrir() {
    let elemento = document.getElementById("sidebar");
      elemento.style.display = "initial";

      let elemento2 = document.getElementById("contenedor__fondo");
      elemento2.style.display = "initial";
  }

  function cerrar() {
      let elemento = document.getElementById("sidebar");
      elemento.style.display = "none";

      let elemento2 = document.getElementById("contenedor__fondo");
      elemento2.style.display = "none";
  }

  // Comprueba si está creado el comprobador del modo oscuro, si no lo crea
  if (localStorage.getItem("modoOscuro") == null) {
    localStorage.setItem("modoOscuro", "false");
  }

  // Cambia el src del logo dependiendo del modo oscuro (solo al cargar la página)
  function cambiarLogo() {
    if (localStorage.getItem("modoOscuro") == "false") {
      let logo = document.getElementById("logoHeader");
      logo.src = "logo.png";

      let logoMovil = document.getElementById("logoHeader--movil");
      logoMovil.src = "logo.png";
    } else {
      let logo = document.getElementById("logoHeader");
      logo.src = "logoOscuro.png";

      let logoMovil = document.getElementById("logoHeader--movil");
      logoMovil.src = "logoOscuro.png";
    }
  }

  window.addEventListener("DOMContentLoaded", cambiarLogo)

  // Cambia el estado del modo oscuro y recarga la página
  function cambiarEstilo() {
    if (localStorage.getItem("modoOscuro") == "false") {
      localStorage.setItem("modoOscuro", "true");
      window.location.reload();
    } else {
      localStorage.setItem("modoOscuro", "false");
      window.location.reload();
    }
  }


  // TODO: OBTENER IMAGEN DE SERVIDOR

  const [imagenUsuario, setImagenUsuario] = React.useState("");

  async function obtenerImagen() {
    try {
      let settings = {
        method : 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("jwt")
        }
      };

      const res = await fetch(`http://127.0.0.1:5000/api/usuario/${localStorage.getItem("id")}`, settings);
      const resJson = await res.json();
      
      setImagenUsuario(resJson.imagen);
    } catch (error) {
        console.log("Error");
    }
  }

  function comprobarLogin() {
    if (localStorage.getItem("jwt") != null) {
      obtenerImagen();
    }
  }

  window.addEventListener('load', comprobarLogin);  

  return (
    <Router>
      <header className="header desktop">
        <a href="/"><img className="header__logo" id="logoHeader" src="logo.png" alt="Logo" /></a>

        <nav>
          <ul className="header__menu">
              <li className="header__menu__element"><a href="/">Home</a></li>
              <li className="header__menu__element"><a href="/recipes">Recipes</a></li>
              <li className="header__menu__element"><a href="/liked">Liked</a></li>
              <li className="header__menu__element"><a href="/upload">Upload recipes</a></li>
              <li className="header__menu__element"><button onClick={cambiarEstilo} className="botones"><FontAwesomeIcon icon="fa-solid fa-moon" size="2x" /></button></li>
              <li className="header__menu__element">
                { localStorage.getItem("jwt") == null ? (
                  <a href="/login"><FontAwesomeIcon icon="fa-solid fa-circle-user" size="2x" /></a>
                ) : (
                  <div className="header__menu__element__contenedorImagen">
                    <a href="/configure"><img src={imagenUsuario} alt="logo"></img></a>
                  </div>
                )
                }
              </li>
          </ul>
        </nav>
      </header>

      <header className="movil header--movil">

        <button onClick={abrir}><FontAwesomeIcon icon="fas fa-bars" size="sm"/></button>
        <a href="/"><img id="logoHeader--movil" src="logo.png" alt="Logo" /></a>
        <nav>
          <ul className="movil--header__menu">
              <li className="movil--header__menu__element">
                { localStorage.getItem("jwt") == null ? (
                  <a href="/login"><FontAwesomeIcon icon="fa-solid fa-circle-user" size="2x" /></a>
                ) : (
                  <div className="header__menu__element__contenedorImagen--movil">
                    <a href="/configure"><img src={imagenUsuario} alt="logo"></img></a>
                  </div>
                )
                }
              </li>
          </ul>
        </nav>
      </header>

      <div id="contenedor__fondo">
      </div>

      <aside className="oculto" id="sidebar">
            <div className="sidebar">
              <div className="sidebar__botones">
                <button className="sidebar__botonCerrar" onClick={cerrar}><FontAwesomeIcon icon="fas fa-bars" size="sm"/></button>
                <button className="sidebar__botonEstilo" onClick={cambiarEstilo}><FontAwesomeIcon icon="fa-solid fa-moon" size="2x" /></button>
              </div>
              <ul className="sidebar__enlaces">
                <li><a href="/">Home</a></li>
                <li><a href="/recipes">Recipes</a></li>
                <li><a href="/liked">Liked</a></li>
                <li><a href="/upload">Upload Recipe</a></li>
              </ul>
              <div className="sidebar__footer">
                <ul>
                  <li><a href=""><span>Cookies</span></a></li>
                  <li><a href=""><span>Privacy</span></a></li>
                  <li><a href=""><span>Legal disclaimer</span></a></li>
                  <li><a href=""><span>Terms and conditions</span></a></li>
                </ul>
              </div>
            </div>
      </aside>


        <Routes>
          <Route path="/recipes" element= {<Recipes />}/>
          <Route path="/recipe" element= {<Recipe />}/>
          <Route path="/liked" element= {<Liked />}/>
          <Route path="/upload" element= {<Upload />} />
          <Route path="/login" element= {<Login />} />
          <Route path="/configure" element= {<Configure />} />
          <Route path="*" element= {<NotFound />}/>
          <Route path="/" element= {<Home />} />
        </Routes>
    </Router>
  );
}

export default App;
