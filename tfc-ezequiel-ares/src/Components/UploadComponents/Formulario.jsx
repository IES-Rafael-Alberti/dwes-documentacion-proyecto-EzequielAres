import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { library } from "@fortawesome/fontawesome-svg-core";


export const Formulario = () => {

    const [nombre, setNombre] = React.useState("");
    const [descripcion, setDescripcion] = React.useState("");
    const [imagen, setImagen] = React.useState("");
    const [video, setVideo] = React.useState("");
    const [pasos, setPasos] = React.useState("");
    const [busquedaIngrediente, setBusquedaIngrediente] = React.useState([]);
    const [ingredientes, setIngredientes] = React.useState([]);
    const [ingredientesPeticion, setIngredientesPeticion] = React.useState([]);
    const [error, setError] = React.useState(null);

    library.add(faPlus);
    const navigate = useNavigate();

    function eliminarHijosDataList(dataList) {

        var length = dataList.options.length - 1;

        for (let i = length; i >= 0; i--) {
            dataList.removeChild(dataList.children[i]);
        }
    }

    function crearDataList(listaIngredientes) {
        let dataList = document.getElementById("ingredientesLista");

        eliminarHijosDataList(dataList);

        for (let ingrediente in listaIngredientes) {
            let newIngredient = document.createElement("option");
            newIngredient.id = [ingrediente];
            newIngredient.value = listaIngredientes[ingrediente][0].nombre;
            dataList.appendChild(newIngredient);
        }
    }

    async function obtenerListaIngredientes() {
        try {
            if (busquedaIngrediente != "") {

                const res = await fetch(`http://127.0.0.1:5000/api/ingrediente/busqueda/${busquedaIngrediente}`);
                const resJson = await res.json();

                crearDataList(resJson);
                return;
            }

        } catch {
            console.log("errorObtenerListaIngredientes");
        }
    }

    function comprobarIngredienteLista() {
        let nombreIngredienteNuevo = document.getElementById("ingredienteNuevo").value;
        let cantidadIngredienteNuevo = document.getElementById("cantidadIngredienteNuevo").value;

        if (nombreIngredienteNuevo == "" || cantidadIngredienteNuevo == "") {
            setError("Empty ingredient name or quantity");
            return false;
        }

        setError("");
        let ingrediente = {
            "nombre": nombreIngredienteNuevo,
            "cantidad": cantidadIngredienteNuevo
        };

        for (let i in ingredientes) {
            if (ingredientes[i].nombre == ingrediente.nombre) {
                setError("Already introduced this ingredient");
                return false;
            }
        }

        return true;
    }


    async function añadirIngredienteNuevoLista() {
        let nombreIngredienteNuevo = document.getElementById("ingredienteNuevo").value;
        let cantidadIngredienteNuevo = document.getElementById("cantidadIngredienteNuevo").value;

        if (comprobarIngredienteLista()) {
            try {

                const res = await fetch(`http://127.0.0.1:5000/api/ingrediente/busqueda/${nombreIngredienteNuevo}`);
                const resJson = await res.json();

                if (Object.keys(resJson).length != 0) {

                    let listaIngredientesPeticion = ingredientesPeticion;
                    let listaIngredientes = ingredientes;
                    let idResJsonObject = Object.keys(resJson)[0];


                    let ingrediente = {
                        "id": resJson[idResJsonObject][0]["id"],
                        "nombre": resJson[idResJsonObject][0]["nombre"],
                        "cantidad": cantidadIngredienteNuevo
                    };


                    let ingredientePeticion = {
                        "ingrediente_id": resJson[idResJsonObject][0]["id"],
                        "cantidad": cantidadIngredienteNuevo
                    };


                    listaIngredientes.push(ingrediente);
                    setIngredientes(listaIngredientes);

                    listaIngredientesPeticion.push(ingredientePeticion);
                    setIngredientesPeticion(listaIngredientesPeticion);

                } else {
                    let settings = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            "nombre": nombreIngredienteNuevo,
                        })
                    };

                    const res = await fetch(`http://127.0.0.1:5000/api/ingrediente/`, settings);
                    const resJson = await res.json();

                    let ingrediente = {
                        "id": resJson.id,
                        "nombre": resJson.nombre,
                        "cantidad": cantidadIngredienteNuevo
                    };


                    let ingredientePeticion = {
                        "ingrediente_id": resJson.id,
                        "cantidad": cantidadIngredienteNuevo
                    };

                    let listaIngredientes = ingredientes;
                    let listaIngredientesPeticion = ingredientesPeticion;

                    listaIngredientes.push(ingrediente);
                    listaIngredientesPeticion.push(ingredientePeticion);

                    setIngredientes(listaIngredientes);
                    setIngredientesPeticion(listaIngredientesPeticion);

                }

            } catch {
                console.log("errorAñadirIngredienteNuevo");
            }
        }

        return;

    }

    async function crearReceta() {
        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('descripcion', descripcion);
            formData.append('imagen', imagen[0]);
            formData.append('video', video[0]);
            formData.append('pasos', pasos);
            formData.append('id_usuario', localStorage.getItem("id"));
            formData.append('ingredientes', JSON.stringify(ingredientesPeticion));

            let settings = {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("jwt")
                }
            };

            const res = await fetch("http://127.0.0.1:5000/api/receta/", settings);
            const resJson = await res.json();

            navigate(`/recipe?id=${resJson.id}`);


        } catch (error) {
            console.log("ErrorCrearReceta");
        }
    }

    const procesarDatos = e => {
        e.preventDefault()

        if (!nombre.trim()) {
            setError("Empty recipe name");
            return
        }
        if (!descripcion.trim()) {
            setError("Empty recipe description");
            return
        }
        if (ingredientes == []) {
            setError("Empty recipe ingredients");
            return
        }
        if (video == "" && !pasos.trim()) {
            setError("You must upload a video if don't complete steps field");
            return
        }
        if (imagen == "") {
            setError("You must upload a image");
            return
        }
        if (!imagen == "") {
            checkImage();
        }
        if (!video == "") {
            checkVideo();
        }
        if (ingredientesPeticion.length == 0) {
            setError("You must add ingredients");
            return;
        }

        setError("");
        crearReceta();
    }

    function getExtension(file) {
        var parts = file.split('.');
        return parts[parts.length - 1];
    }

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

    function checkVideo() {
        let ext = getExtension(video[0].name);
        switch (ext.toLowerCase()) {
            case 'm4v':
            case 'avi':
            case 'mpg':
            case 'mp4':
            case 'webm':
                return;
        }
        setError("Wrong type for video");
        return;
    }

    return (
        <section className='Upload__main__contenedor'>
            <form onSubmit={procesarDatos} className="Upload__main__contenedor__formulario">
                <fieldset>
                    <label htmlFor='Name'>
                        Name
                        <input type="text" name="Name" onChange={e => setNombre(e.target.value)} />
                    </label>
                    <label htmlFor='Descripcion'>
                        Description
                    </label>
                    <textarea rows="5" cols="60" onChange={e => setDescripcion(e.target.value)} name="Descripcion" placeholder='Enter description here...' />
                    <label htmlFor='Pasos'>
                        Steps
                    </label>
                    <textarea rows="5" cols="60" onChange={e => setPasos(e.target.value)} name="Pasos" placeholder='Enter steps here...' />

                    <div className='Upload__main__contenedor__formulario__ingredientes'>
                        <label htmlFor="Ingredientes">
                            Ingredients

                            <input onChange={(e) => { setBusquedaIngrediente(e.target.value); obtenerListaIngredientes(); }} id='ingredienteNuevo' type="text" name='Ingredientes' list="ingredientesLista" />
                        </label>
                        <datalist id="ingredientesLista">
                        </datalist>

                        <label htmlFor="cantidad">
                            <input type="text" placeholder='Quantity' id='cantidadIngredienteNuevo' name='cantidad' />
                        </label>
                        <button type='button' onClick={añadirIngredienteNuevoLista}><FontAwesomeIcon icon="fa-solid fa-plus" /></button>
                    </div>

                    <ul>
                        {
                            ingredientes.map(item => (
                                <li key={item.id}>{item.nombre} {item.cantidad}</li>
                            ))
                        }
                    </ul>

                    <label htmlFor='Imagen'>
                        Image
                        <input type="file" name='Imagen' onChange={e => setImagen(e.target.files)} />
                    </label>
                    <label htmlFor='Video'>
                        Video
                        <input type="file" name='Video' onChange={e => setVideo(e.target.files)} />

                    </label>
                </fieldset>
                {
                    error ? (
                        <p className='error'> {error} </p>
                    ) : (<p></p>)
                }
                <input type="submit" value="Save" />
            </form>
        </section>
    )
}
