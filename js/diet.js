const DAILY_GOAL = 2000;

// Load meals from localStorage
function loadMeals() {
  const meals = JSON.parse(localStorage.getItem("meals")) || [];

  let totals = { calories: 0, protein: 0, carbs: 0, fats: 0 };
  const list = document.getElementById("mealList");
  list.innerHTML = "";

  meals.forEach((meal, index) => {
    totals.calories += meal.calories;
    totals.protein += meal.protein;
    totals.carbs += meal.carbs;
    totals.fats += meal.fats;

    list.innerHTML += `
      <div class="meal-card">
        <h4>${meal.name}</h4>
        <p>Calories: ${meal.calories} kcal</p>
        <p>Protein: ${meal.protein} g</p>
        <p>Carbs: ${meal.carbs} g</p>
        <p>Fats: ${meal.fats} g</p>
        <button onclick="deleteMeal(${index})">Delete</button>
      </div>
    `;
  });

  document.getElementById("totalCalories").textContent = totals.calories;
  document.getElementById("totalProtein").textContent = totals.protein;
  document.getElementById("totalCarbs").textContent = totals.carbs;
  document.getElementById("totalFats").textContent = totals.fats;

  document.getElementById("calorieProgress").style.width =
    Math.min((totals.calories / DAILY_GOAL) * 100, 100) + "%";
}

// Add meal (frontend only)
function addMeal() {
  const name = document.getElementById("mealName").value;
  const calories = Number(document.getElementById("calories").value);
  const protein = Number(document.getElementById("protein").value);
  const carbs = Number(document.getElementById("carbs").value);
  const fats = Number(document.getElementById("fats").value);

  if (!name || !calories) {
    alert("Please enter meal name and calories");
    return;
  }

  const meals = JSON.parse(localStorage.getItem("meals")) || [];

  meals.push({ name, calories, protein, carbs, fats });

  localStorage.setItem("meals", JSON.stringify(meals));

  clearInputs();
  loadMeals();
}

// Delete meal
function deleteMeal(index) {
  const meals = JSON.parse(localStorage.getItem("meals")) || [];
  meals.splice(index, 1);
  localStorage.setItem("meals", JSON.stringify(meals));
  loadMeals();
}

// Clear input fields
function clearInputs() {
  mealName.value = "";
  calories.value = "";
  protein.value = "";
  carbs.value = "";
  fats.value = "";
}

// Initial load
loadMeals();
