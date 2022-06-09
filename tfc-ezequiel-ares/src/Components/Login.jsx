import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Footer } from './LoginComponents/Footer';
import { Formulario } from './LoginComponents/Formulario';

export const Login = () => {

  const navigate = useNavigate();

  // Función para comprobar el estilo que vamos a aplicar a la página
  useEffect(() => {
    if (localStorage.getItem("modoOscuro") == "true") {
      require('../css/login/loginNoche.scss');
      require('../css/login/loginResponsive.scss');
      require('../css/desplegableNoche.scss');
    } else {
      require('../css/login/login.scss');
      require('../css/login/loginResponsive.scss');
      require('../css/desplegable.scss');
    }
  })

  // Comprueba si hemos iniciado sesion, si lo estamos redirige al login
  function comprobarLogin() {
    if (localStorage.getItem("jwt") != null) {
      navigate("/configure");
    }
  }

  window.addEventListener('load', comprobarLogin);

  return (
    <main className='Login__main'>
      <Formulario />
      <Footer />
    </main>
  )
}
