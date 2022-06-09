import React, { useEffect } from 'react';
import { Footer } from './RecipeComponents/Footer';
import { RecipeDetails } from './RecipeComponents/RecipeDetails';
import { Comments } from './RecipeComponents/Comments';

export const Recipe = () => {

  // Función para comprobar el estilo que vamos a aplicar a la página
  useEffect(() => {
    if (localStorage.getItem("modoOscuro") == "true") {
      require('../css/recipe/recipeNoche.scss');
      require('../css/recipe/recipeResponsive.scss');
      require('../css/desplegableNoche.scss');
    } else {
      require('../css/recipe/recipe.scss');
      require('../css/recipe/recipeResponsive.scss');
      require('../css/desplegable.scss');
    }
  })

  return (
    <main>
      <RecipeDetails />
      <Comments />
      <Footer />
    </main>
  )
}
