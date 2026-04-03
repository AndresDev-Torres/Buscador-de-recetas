import "./App.css"
import { useState } from "react"

function App() {

  const [query, setQuery] = useState("")
  const [meals, setMeals] = useState([])
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [searched, setSearched] = useState(false)

  const searchMeals = async () => {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    const data = await res.json()
    setMeals(data.meals || [])
    setSearched(true)
  }

  const getIngredients = (meal) => {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push(`${measure} ${ingredient}`)
    }
  }
  return ingredients
}
  
  return(
  <div className="app">
    <header>
      <h1>Buscador de recetas</h1>
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Buscar recetas..." 
          value={query}
          onChange={(e) => {setQuery(e.target.value)
                            setSearched(false)}
                    }
          onKeyDown={(e) => {
              if (e.key === 'Enter') searchMeals()
            }}
        />
        <button onClick={searchMeals}>Buscar</button>
      </div>
    </header>

    <div className="grid">
      {meals.map(meal => (
        <div className="card" key={meal.idMeal} onClick={() => setSelectedMeal(meal)}>
          <img src={meal.strMealThumb} alt={meal.strMeal} />
          <h3>{meal.strMeal}</h3>
        </div>
      ))}
    </div>


    {searched && meals.length === 0 && (
      <p className="empty">😕 No se encontraron recetas para "<strong>{query}</strong>"</p>
    )}


    {selectedMeal && (
      <div className="modal-overlay" onClick={() => setSelectedMeal(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <button className="close-btn" onClick={() => setSelectedMeal(null)}>✕</button>
          
          <div className="modal-hero">
            <img src={selectedMeal.strMealThumb} alt={selectedMeal.strMeal} />
            <div className="modal-hero-info">
              <h2>{selectedMeal.strMeal}</h2>
              <p>🍽 {selectedMeal.strCategory}</p>
              <p>🌍 {selectedMeal.strArea}</p>
            </div>
          </div>

          <div className="modal-body">
            <div className="ingredients">
              <h3>Ingredientes</h3>
              <ul>
                {getIngredients(selectedMeal).map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="instructions">
              <h3>Instrucciones</h3>
              <p>{selectedMeal.strInstructions}</p>
            </div>
          </div>

        </div>
      </div>
    )}
  </div>
)
}

export default App