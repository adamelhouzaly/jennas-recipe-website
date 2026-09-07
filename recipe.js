// function generateRecipe() {
//   // Get the user input
//   let ingredients = document.getElementById("ingredients").value.trim();
  
//   // Result container
//   let recipeResultDiv = document.getElementById("recipe-result");

//   // Validate input
//   if (!ingredients) {
//     recipeResultDiv.innerHTML = '<p class="text-danger">Please enter some ingredients!</p>';
//     return;
//   }

//   // Construct the API URL
//   let url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=YOUR_API_KEY`;
//   console.log(url);

//   // Create a new XMLHttpRequest
//   let request = new XMLHttpRequest();

//   // Open the GET request
//   request.open("GET", url, true);

//   // Define the behavior when the response is received
//   request.onload = function () {
//     if (this.status >= 200 && this.status < 400) {
//       // Parse the response
//       let data = JSON.parse(this.response);

//       // Check if any recipes are found
//       if (data.length === 0) {
//         recipeResultDiv.innerHTML = '<p class="text-danger">No recipes found. Try different ingredients.</p>';
//         return;
//       }

//       // Display the first recipe
//       let recipe = data[0];
//       let frontImg = recipe.image;
//       let title = recipe.title;
//       let usedIngredients = recipe.usedIngredientCount;
//       let missedIngredients = recipe.missedIngredientCount;
//       let recipeLink = `https://spoonacular.com/recipes/${title}-${recipe.id}`;

//       // Update the HTML
//       recipeResultDiv.innerHTML = `
//         <div class="card">
//           <img src="${frontImg}" class="card-img-top" alt="${title}">
//           <div class="card-body">
//             <h5 class="card-title">${title}</h5>
//             <p class="card-text">Ingredients: ${usedIngredients} used, ${missedIngredients} missing.</p>
//             <a href="${recipeLink}" target="_blank" class="btn btn-primary">View Recipe</a>
//           </div>
//         </div>
//       `;
//     } else {
//       // Handle API errors
//       recipeResultDiv.innerHTML = '<p class="text-danger">Error fetching recipes. Please try again later.</p>';
//     }
//   };

//   // Handle network errors
//   request.onerror = function () {
//     recipeResultDiv.innerHTML = '<p class="text-danger">Network error. Please check your connection and try again.</p>';
//   };

//   // Send the request
//   request.send();
// }

// // Attach the function to the form submission
// document.getElementById("recipe-form").addEventListener("submit", function (e) {
//   e.preventDefault();
//   generateRecipe();
// });
const apiKey = '9bc5aaa27de041638b84290dd06d96ab';

document.getElementById('searchButton').addEventListener('click', async () => {
    const ingredient1 = document.getElementById('ingredient1').value.trim();
    const ingredient2 = document.getElementById('ingredient2').value.trim();
    const ingredient3 = document.getElementById('ingredient3').value.trim();

    const ingredients = [ingredient1, ingredient2, ingredient3].filter(ing => ing);

    if (ingredients.length === 0) {
        alert('Please enter at least one ingredient.');
        return;
    }

    const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(',')}&apiKey=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Error in API response: ' + response.statusText);
        }
        const data = await response.json();
        // For each recipe, fetch detailed information
        for (const recipe of data) {
            await fetchRecipeDetails(recipe.id);
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
});

async function fetchRecipeDetails(recipeId) {
    const apiUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Error in API response: ' + response.statusText);
        }
        const recipeDetails = await response.json();
        displayResults(recipeDetails);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function displayResults(recipe) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe');
    
    recipeDiv.innerHTML = `
        <h3>${recipe.title}</h3>
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" />
        <p><strong>Ingredients:</strong> ${recipe.extendedIngredients.map(ing => ing.name).join(', ')}</p>
        <p><strong>Preparation Time:</strong> ${recipe.readyInMinutes} minutes</p>
        <p><strong>Servings:</strong> ${recipe.servings}</p>
        <p><strong>Instructions:</strong> ${recipe.instructions ? recipe.instructions : 'Instructions not available.'}</p>
        <p><strong>Calories:</strong> ${recipe.nutrition ? recipe.nutrition.nutrients.find(nut => nut.title === "Calories").amount : 'N/A'} kcal</p>
        <p><strong>Fat:</strong> ${recipe.nutrition ? recipe.nutrition.nutrients.find(nut => nut.title === "Fat").amount : 'N/A'} g</p>
        <p><strong>Protein:</strong> ${recipe.nutrition ? recipe.nutrition.nutrients.find(nut => nut.title === "Protein").amount : 'N/A'} g</p>
        <p><strong>Carbs:</strong> ${recipe.nutrition ? recipe.nutrition.nutrients.find(nut => nut.title === "Carbohydrates").amount : 'N/A'} g</p>
        <p><strong>Source:</strong> <a href="${recipe.sourceUrl}" target="_blank">Full recipe</a></p>
    `;
    
    resultsDiv.appendChild(recipeDiv);
}
