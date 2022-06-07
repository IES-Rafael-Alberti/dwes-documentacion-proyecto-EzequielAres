import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

export const Configure = () => {

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

  const [nombre, setNombre] = React.useState("");
  const [nick, setNick] = React.useState("");
  const [imagen, setImagen] = React.useState("");
  const [nuevaImagen, setNuevaImagen] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  // Carga los datos del usuario con el que hemos iniciado sesion
  async function cargarDatos() {
    try {
      let settings = {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("jwt")
        }
      };

      const res = await fetch(`http://127.0.0.1:5000/api/usuario/${localStorage.getItem("id")}`, settings);
      const resJson = await res.json();

      setNombre(resJson.nombre);
      setNick(resJson.nick);
      setImagen(resJson.imagen);
      setEmail(resJson.email);

    } catch (error) {
      console.log("Error");
    }
  }


  window.addEventListener('load', cargarDatos);


  // Eliminamos el jwt y el id para cerrar sesion y redirigimos al home
  function cerrarSesion() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("id");
    navigate("/");
  }

  const procesarDatos = e => {
    e.preventDefault()

    if (!nick.trim()) {
      setError("Empty nick");
      return
    }
    if (!email.trim()) {
      setError("Empty email");
      return
    }
    if (!nombre.trim()) {
      setError("Empty username");
      return
    }
    if (pass != "" && pass.length < 8) {
      setError("Pass has to be more than 7 characters");
      return
    }
    if (!imagen == "") {
      checkImage();
    }

    setError("");

    cambiar();
  }

  function getExtension(file) {
    var parts = file.split('.');
    return parts[parts.length - 1];
  }

  function checkImage() {
    try {
      let ext = getExtension(nuevaImagen[0].name);
      switch (ext.toLowerCase()) {
        case 'jpg':
        case 'bmp':
        case 'png':
          return;
      }
      setError("Wrong type for image");
      return;
    } catch {
      return;
    }
  }

  const cambiar = React.useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('nick', nick);
      formData.append('email', email);
      formData.append('hashed_password', pass);

      if (nuevaImagen == "") {
        formData.append('imagen', imagen);
      } else {
        formData.append('imagen', "");
        formData.append('nuevaImagen', nuevaImagen[0]);
      }

      let settings = {
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem("jwt") },
        body: formData,
      };

      const res = await fetch(`http://127.0.0.1:5000/api/usuario/${localStorage.getItem("id")}`, settings);
      const resJson = await res.json();


      setNombre("");
      setImagen("");
      setNuevaImagen("");
      setNick("");
      setEmail("");
      setPass("");
      setError("");

      navigate("/");
    } catch (error) {
      setError("Error");
    }
  }, [nombre, nick, email, imagen, pass, nuevaImagen])

  async function deleteUser() {
    try {

      let settings = {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("jwt")
        }
      };

      const res = await fetch(`http://127.0.0.1:5000/api/usuario/${localStorage.getItem("id")}`, settings);

      setError("");

      localStorage.removeItem("jwt");
      localStorage.removeItem("id");
      navigate("/");

    } catch (error) {
      console.log("errorEliminarUser")
    }
  }

  return (
    <main className='Configure__main'>
      <section className='Configure__main__contenedor'>
        <form onSubmit={procesarDatos} className="Configure__main__contenedor__formulario">
          <label htmlFor='Username'>
            Username
          </label>
          <input type="text" name="Username" value={nombre} onChange={e => setNombre(e.target.value)} />
          <label htmlFor='Nick'>
            Nick
          </label>
          <input type="text" name="Nick" value={nick} onChange={e => setNick(e.target.value)} />
          <label htmlFor='Email'>
            Email
          </label>
          <input type="text" name="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <label htmlFor="Password">
            Password
          </label>
          <input type="password" name='Password' onChange={e => setPass(e.target.value)} />
          <label htmlFor='Imagen'>
            Image
          </label>
          <input type="file" onChange={e => setNuevaImagen(e.target.files)} />
          {
            error ? (
              <p className='error'> {error} </p>
            ) : (<p></p>)
          }
          <input type="submit" value="Save" />
        </form>
        <button onClick={cerrarSesion} className='Configure__main__contenedor__cerrarSesion'>Logout</button>
        <button onClick={deleteUser} className='Configure__main__contenedor__deleteUser'>Delete User</button>
      </section>
      <footer className='Configure__main__footer'>
        <section className='Configure__main__footer__contenedor1'>
          <a href='/'><span>Cookpedia</span></a>
          <div className='Configure__main__footer_contenedor1__rrss'>
            <a href=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" /></svg></a>
            <a href=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" /></svg></a>
            <a href=""><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" /></svg></a>
          </div>
        </section>
        <section className='Configure__main__footer_contenedor2 desktop'>
          <a href=""><span>Legal disclaimer</span></a>
          <a href=""><span>Cookies</span></a>
          <a href=""><span>Privacy</span></a>
          <a href=""><span>Terms and conditions</span></a>
        </section>
      </footer>
    </main>
  )
}
