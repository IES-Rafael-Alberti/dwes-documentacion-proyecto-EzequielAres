import React, { useEffect } from 'react';
import { Footer } from './RecipesComponents/Footer';
import { ListRecipes } from './RecipesComponents/ListRecipes';

export const Recipes = () => {

  // Función para comprobar el estilo que vamos a aplicar a la página
  useEffect(() => {
    if (localStorage.getItem("modoOscuro") == "true") {
      require('../css/recipes/recipesNoche.scss');
      require('../css/recipes/recipesResponsive.scss');
      require('../css/desplegableNoche.scss');
    } else {
      require('../css/recipes/recipes.scss');
      require('../css/recipes/recipesResponsive.scss');
      require('../css/desplegable.scss');
    }
  })

  return (
    <main className='Recipes__main'>
      <ListRecipes />
      <Footer />
    </main>
  )
}
