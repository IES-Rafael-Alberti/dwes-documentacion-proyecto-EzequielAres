import React, { useEffect } from 'react'
import { FormularioConfigure } from './ConfigureComponents/FormularioConfigure';
import { useNavigate } from 'react-router-dom';
import { Footer } from './ConfigureComponents/Footer';

export const Configure = () => {
  const navigate = useNavigate();

  // Función para comprobar el estilo que vamos a aplicar a la página
  useEffect(() => {
    if (localStorage.getItem("modoOscuro") == "true") {
      require('../css/configure/configureNoche.scss');
      require('../css/configure/configureResponsive.scss');
      require('../css/desplegableNoche.scss');
    } else {
      require('../css/configure/configure.scss');
      require('../css/configure/configureResponsive.scss');
      require('../css/desplegable.scss');
    }
  })

  // Comprueba si hemos iniciado sesion, si no redirige a login
  function comprobarLogin() {
    if (localStorage.getItem("jwt") == undefined) {
      navigate("/login");
    }
  }

  window.addEventListener('load', comprobarLogin);

  return (
    <main className='Configure__main'>
      <FormularioConfigure />
      <Footer />
    </main>
  )
}
