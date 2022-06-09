import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Formulario = () => {

    const [nombre, setNombre] = React.useState("")
    const [nick, setNick] = React.useState("")
    const [imagen, setImagen] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [pass, setPass] = React.useState("")
    const [error, setError] = React.useState(null)
    const [esRegistro, setEsRegistro] = React.useState(false)
    const navigate = useNavigate();

    // Función que comprueba los diferentes datos del formulario
    const procesarDatos = e => {
        e.preventDefault();

        if (!esRegistro) {
            if (!nombre.trim()) {
                setError("Empty username");
                return
            }
            if (!pass.trim()) {
                setError("Empty password");
                return
            }
            if (pass.length < 7) {
                setError("Pass has to be more than 7 characters");
                return
            }
        }

        if (esRegistro) {
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
            if (!pass.trim()) {
                setError("Empty password");
                return
            }
            if (pass.length < 8) {
                setError("Pass has to be more than 7 characters");
                return
            }
            if (!imagen == "") {
                checkImage();
            }
        }

        setError(null)

        if (esRegistro) {
            registrar()
        } else {
            login()
        }
    }

    // Función para obtener la extensión de la imagen
    function getExtension(file) {
        var parts = file.split('.');
        return parts[parts.length - 1];
    }

    // Función comprobar que la extensión de la imagen es correcta
    function checkImage() {
        let ext = getExtension(imagen[0].name);
        switch (ext.toLowerCase()) {
            case 'jpg':
            case 'bmp':
            case 'png':
                return;
        }
        setError("Wrong type for image");
        return;
    }

    // Función para crear el usuario, una vez creado iniciamos sesión
    const registrar = React.useCallback(async () => {
        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('nick', nick);
            formData.append('email', email);
            formData.append('imagen', imagen[0]);
            formData.append('hashed_password', pass);

            let settings = {
                method: 'POST',
                body: formData
            };

            const res = await fetch("http://127.0.0.1:5000/api/usuario/", settings);
            const resJson = await res.json();


            setNombre("");
            setImagen("");
            setNick("");
            setEmail("");
            setPass("");
            setEsRegistro(false);
            setError(null);

            login();

            navigate("/");
        } catch (error) {
            setError("Error");
        }
    }, [nombre, nick, email, imagen, pass])


    // Función para iniciar sesión
    const login = React.useCallback(async () => {
        try {

            let settings = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "nombre": nombre,
                    "password": pass
                })
            };

            const res = await fetch("http://localhost:5000/login", settings);
            const resJson = await res.json();

            // Si no devuelve id ni jwt establecemos un error
            if (resJson.id == null || resJson.access_token == null) {
                setError("Invalid credentials");
                return
            }

            // Guardamos en el almacenamiento del navegador los diferentes valores
            localStorage.setItem("jwt", resJson.access_token);
            localStorage.setItem("id", resJson.id);
            localStorage.setItem("admin", resJson.admin);

            setNombre("");
            setPass("");
            setEsRegistro(false);
            setError("");

            navigate("/");
        } catch (error) {
            setError("Wrong credentials")

        }
    }, [nombre, pass])

    return (
        <section className='Login__main__contenedor'>
            {!esRegistro ? (
                <form onSubmit={procesarDatos} className="Login__main__contenedor__formularioLogin">
                    <label htmlFor='Username'>
                        Username
                    </label>
                    <input type="text" name="Username" onChange={e => setNombre(e.target.value)} />
                    <label htmlFor="Password">
                        Password
                    </label>
                    <input type="password" name='Password' onChange={e => setPass(e.target.value)} />
                    {
                        error ? (
                            <p className='error'> {error} </p>
                        ) : (<p></p>)
                    }
                    <input type="submit" value="Log in" />
                    <span>Not registered yet?</span>
                    <button type="button" onClick={() => setEsRegistro(!esRegistro)}>Register</button>
                </form>
            ) : (
                <form onSubmit={procesarDatos} className="Login__main__contenedor__formularioRegister">
                    <label htmlFor='Username'>
                        Username
                    </label>
                    <input type="text" name="Username" onChange={e => setNombre(e.target.value)} />
                    <label htmlFor='Nick'>
                        Nick
                    </label>
                    <input type="text" name="Nick" onChange={e => setNick(e.target.value)} />
                    <label htmlFor='Email'>
                        Email
                    </label>
                    <input type="text" name="Email" onChange={e => setEmail(e.target.value)} />
                    <label htmlFor="Password">
                        Password
                    </label>
                    <input type="password" name='Password' onChange={e => setPass(e.target.value)} />
                    <label htmlFor='Imagen'>
                        Imagen
                    </label>
                    <input type="file" name="Imagen" onChange={e => setImagen(e.target.files)} />
                    {
                        error ? (
                            <p className='error'> {error} </p>
                        ) : (<p></p>)
                    }
                    <input type="submit" value="Register" />
                    <span>Already have an account?</span>
                    <button type="button" onClick={() => setEsRegistro(!esRegistro)} > Log in</button>
                </form>
            )}
        </section>
    )
}
