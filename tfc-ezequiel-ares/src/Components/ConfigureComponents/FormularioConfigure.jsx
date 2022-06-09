import React from 'react';
import { BotonDeleteUser } from './BotonDeleteUser';
import { BotonLogout } from './BotonLogout';
import { useNavigate } from 'react-router-dom';

export const FormularioConfigure = () => {

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

    // Función que comprueba los diferentes datos del formulario
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

    // Función para obtener la extensión de la imagen
    function getExtension(file) {
        var parts = file.split('.');
        return parts[parts.length - 1];
    }

    // Función comprobar que la extensión de la imagen es correcta
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

    window.addEventListener('load', cargarDatos);

    // Función para cambiar los datos del usuario
    const cambiar = React.useCallback(async () => {
        try {

            // Creamos el formData con los datos que hemos cambiado
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('nick', nick);
            formData.append('email', email);
            formData.append('hashed_password', pass);

            // Si no hemos introducido una imagen nueva dejamos la imagen que teniamos anteriormente, si no cargamos la nueva
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

    return (
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
            <BotonLogout />
            <BotonDeleteUser />
        </section>
    )
}
