const API = "http://localhost:5000/api/diet";
const token = localStorage.getItem("token");
const DAILY_GOAL = 2000;

async function loadMeals() {
  const res = await fetch(API, {
    headers: { Authorization: "Bearer " + token }
  });
  const meals = await res.json();

  let totals = { calories:0, protein:0, carbs:0, fats:0 };
  const list = document.getElementById("mealList");
  list.innerHTML = "";

  meals.forEach(meal => {
    totals.calories += meal.calories;
    totals.protein += meal.protein;
    totals.carbs += meal.carbs;
    totals.fats += meal.fats;

    list.innerHTML += `
      <div class="card">
        <h4>${meal.mealName}</h4>
        <p>${meal.calories} kcal</p>
        <button onclick="deleteMeal('${meal._id}')">Delete</button>
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

async function addMeal() {
  const body = {
    mealName: mealName.value,
    calories: +calories.value,
    protein: +protein.value,
    carbs: +carbs.value,
    fats: +fats.value
  };

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(body)
  });

  loadMeals();
}

async function deleteMeal(id) {
  await fetch(API + "/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });
  loadMeals();
}

loadMeals();
