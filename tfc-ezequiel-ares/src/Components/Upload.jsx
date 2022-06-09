import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from './UploadComponents/Footer';
import { Formulario } from './UploadComponents/Formulario';


export const Upload = () => {

  const navigate = useNavigate();

  // Función para comprobar el estilo que vamos a aplicar a la página
  useEffect(() => {
    if (localStorage.getItem("modoOscuro") == "true") {
      require('../css/upload/uploadNoche.scss');
      require('../css/upload/uploadResponsive.scss');
      require('../css/desplegableNoche.scss');
    } else {
      require('../css/upload/upload.scss');
      require('../css/upload/uploadResponsive.scss');
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
    <main>
      <Formulario />
      <Footer />
    </main>
  )
}
