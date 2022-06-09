import React from 'react'

export const RandomRecipe = () => {

    // Función para obtener una receta aleatoria
    async function recetaAleatoria() {
        try {
            const res = await fetch("http://127.0.0.1:5000/api/receta/count");
            const resJson = await res.json();

            // Obtenemos la cantidad de recetas que hay en la base de datos y generamos un número aleatorio 
            let idAleatorio = Math.floor(Math.random() * (resJson - 1)) + 1;

            // Le asignamos al enlace el href correspondiente para dirigirnos a la receta aleatoria
            let a = document.getElementById("botonRecetaAleatoria");
            a.href = `/recipe?id=${idAleatorio}`;

        } catch (error) {
            console.log("error");
        }
    }

    window.addEventListener('load', recetaAleatoria);

    return (
        <section className='main__randomrecipe'>

            <div className='main__randomrecipe__contenedorImagen'>
                <img src="recetaAleatoria.jpg" alt="recetaAleatoria" />
            </div>

            <div className='main__randomrecipe__texto'>

                <span>What cook next</span>
                <a href="" id='botonRecetaAleatoria'>Continue</a>

            </div>

        </section>
    )
}
