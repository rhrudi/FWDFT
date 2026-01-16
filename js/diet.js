// DAILY_GOAL is now dynamic

const API_URL = "http://localhost:5000/api/diet";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

// Load meals from Backend
async function loadMeals() {
  try {
    const res = await fetch(API_URL, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const meals = await res.json();
    renderMeals(meals);
  } catch (err) {
    console.error("Error loading meals:", err);
  }
}

function renderMeals(meals) {
  let totals = { calories: 0, protein: 0, carbs: 0, fats: 0 };
  const list = document.getElementById("mealList");
  list.innerHTML = "";

  // Reset to 0 first
  document.getElementById("calorieProgress").style.width = "0%";

  meals.forEach((meal) => {
    totals.calories += Number(meal.calories || 0);
    totals.protein += Number(meal.protein || 0);
    totals.carbs += Number(meal.carbs || 0);
    totals.fats += Number(meal.fats || 0);

    list.innerHTML += `
      <div class="meal-card">
        <h4>${meal.name}</h4>
        <p>Calories: ${meal.calories} kcal</p>
        <p>Protein: ${meal.protein} g</p>
        <p>Carbs: ${meal.carbs} g</p>
        <p>Fats: ${meal.fats} g</p>
        <button onclick="deleteMeal('${meal._id}')">Delete</button>
      </div>
    `;
  });

  document.getElementById("totalCalories").textContent = totals.calories;
  document.getElementById("totalProtein").textContent = totals.protein;
  document.getElementById("totalCarbs").textContent = totals.carbs;
  document.getElementById("totalFats").textContent = totals.fats;

  const dailyGoal = getDailyGoal();
  const widthPct = Math.min((totals.calories / dailyGoal) * 100, 100);

  const bar = document.getElementById("calorieProgress");
  if (widthPct <= 0 || isNaN(widthPct)) {
    bar.style.width = "0%";
    bar.style.display = "none";
  } else {
    bar.style.display = "block";
    bar.style.width = widthPct + "%";
  }
}

// Add meal
async function addMeal() {
  const name = document.getElementById("mealName").value;
  const calories = Number(document.getElementById("calories").value);
  const protein = Number(document.getElementById("protein").value);
  const carbs = Number(document.getElementById("carbs").value);
  const fats = Number(document.getElementById("fats").value);

  if (!name || !calories) {
    alert("Please enter meal name and calories");
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name, calories, protein, carbs, fats })
    });

    if (res.ok) {
      clearInputs();
      loadMeals();
    } else {
      alert("Failed to add meal");
    }
  } catch (err) {
    console.error("Error adding meal:", err);
  }
}

// Delete meal
async function deleteMeal(id) {
  if (!confirm("Delete this meal?")) return;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    loadMeals();
  } catch (err) {
    console.error("Error deleting meal:", err);
  }
}

// Clear input fields
function clearInputs() {
  document.getElementById("mealName").value = "";
  document.getElementById("calories").value = "";
  document.getElementById("protein").value = "";
  document.getElementById("carbs").value = "";
  document.getElementById("fats").value = "";
}

// Initial load
loadMeals();

/* ---------- GOAL MANAGEMENT ---------- */
function getDailyGoal() {
  return Number(localStorage.getItem("dailyGoal")) || 2000;
}

function setDailyGoal(val) {
  localStorage.setItem("dailyGoal", val);
  document.getElementById("dailyGoalDisplay").value = val;
  loadMeals(); // Re-render to update bar
}

// Bind input to functionality
document.getElementById("dailyGoalDisplay").addEventListener("change", (e) => {
  let val = Number(e.target.value);
  if (val < 1000) val = 1000; // Minimum safety
  setDailyGoal(val);
});

// Initialize input on load
document.getElementById("dailyGoalDisplay").value = getDailyGoal();


function suggestDiet() {
  const goal = document.getElementById("dietGoal").value;
  const box = document.getElementById("dietSuggestionBox");

  if (!goal) {
    box.innerHTML = "<p>Please select a goal.</p>";
    return;
  }

  if (goal === "loss") {
    setDailyGoal(1800); // Auto-update goal
    box.innerHTML = `
      <h4>Weight Loss Plan (1800 kcal)</h4>
      <ul>
        <li>Goal set to 1800 kcal/day</li>
        <li>Protein: High (lean chicken, eggs, tofu)</li>
        <li>Carbs: Low (oats, brown rice)</li>
        <li>Fats: Healthy (nuts, olive oil)</li>
        <li>Foods: Salads, fruits, vegetables</li>
      </ul>
    `;
  } else if (goal === "gain") {
    setDailyGoal(2800); // Auto-update goal
    box.innerHTML = `
      <h4>Weight Gain Plan (2800 kcal)</h4>
      <ul>
         <li>Goal set to 2800 kcal/day</li>
        <li>Protein: Very High (chicken, fish, paneer)</li>
        <li>Carbs: High (rice, potatoes, pasta)</li>
        <li>Fats: Healthy (peanut butter, nuts)</li>
        <li>Foods: Milk, bananas, dry fruits</li>
      </ul>
    `;
  }
}
