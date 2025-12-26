console.log("WORKOUTS.JS LOADED");

const container = document.querySelector(".workout-cards");
const addBtn = document.getElementById("addWorkoutBtn");

const STORAGE_KEY = "workouts";

/* ---------- UTILITIES ---------- */
function loadWorkouts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveWorkouts(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/* ---------- RANDOMIZE DEFAULT SUGGESTIONS ---------- */
function randomizeSuggested() {
    document.querySelectorAll(".suggested-item").forEach(item => {
        const type = item.dataset.type;
        let value = "";

        if (type === "Plank") {
            value = `${(Math.floor(Math.random() * 4) + 1) * 30} seconds`;
        } else {
            value = `${Math.floor(Math.random() * 20) + 10} reps`;
        }

        item.dataset.reps = value;
        item.querySelector("span").textContent = `${value} — ${type}`;
    });
}
randomizeSuggested();

/* ---------- RENDER WORKOUT CARDS ---------- */
function renderWorkouts() {
    const workouts = loadWorkouts();
    container.innerHTML = "";

    workouts.forEach((w, index) => {
        const card = document.createElement("div");
        card.className = "workout-card";

        card.innerHTML = `
            <h2>${w.type}</h2>
            <p>${w.reps}</p>
            <p class="timestamp">Added on: ${new Date(w.createdAt).toLocaleString()}</p>

            <button class="done-btn">
                ${w.completed ? "Completed ✔" : "Mark as Done"}
            </button>
            <button class="delete-btn">Delete</button>
        `;

        // COMPLETE BUTTON
        card.querySelector(".done-btn").addEventListener("click", () => {
            w.completed = !w.completed;
            w.completedOn = w.completed ? new Date().toISOString() : null;
            saveWorkouts(workouts);
            renderWorkouts();
        });

        // DELETE BUTTON
        card.querySelector(".delete-btn").addEventListener("click", () => {
            workouts.splice(index, 1);
            saveWorkouts(workouts);
            renderWorkouts();
        });

        container.appendChild(card);
    });
}

/* ---------- ADD WORKOUT MANUALLY ---------- */
addBtn.addEventListener("click", e => {
    e.preventDefault();

    const type = document.getElementById("exerciseType").value;
    const reps = document.getElementById("workoutReps").value.trim();

    if (!type || !reps) {
        alert("Please fill all fields");
        return;
    }

    const workouts = loadWorkouts();
    workouts.push({
        type,
        reps,
        completed: false,
        completedOn: null,
        createdAt: new Date().toISOString()
    });

    saveWorkouts(workouts);
    renderWorkouts();

    document.getElementById("exerciseType").selectedIndex = 0;
    document.getElementById("workoutReps").value = "";
});

/* ---------- SUGGESTED WORKOUT ADD ---------- */
function attachSuggestedButtons() {
    document.querySelectorAll(".suggested-item .suggest-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            const item = e.target.closest(".suggested-item");

            const workouts = loadWorkouts();
            workouts.push({
                type: item.dataset.type,
                reps: item.dataset.reps,
                completed: false,
                completedOn: null,
                createdAt: new Date().toISOString()
            });

            saveWorkouts(workouts);
            renderWorkouts();
        });
    });
}
attachSuggestedButtons();

/* ---------- AI-LIKE GENERATOR ---------- */
const WORKOUT_DB = {
    strength: ["Push-ups", "Squats", "Lunges", "Burpees", "Tricep Dips"],
    cardio: ["Jumping Jacks", "High Knees", "Mountain Climbers"],
    core: ["Plank", "Crunches", "Leg Raises"]
};

function getRepsFor(ex, diff) {
    if (ex === "Plank") {
        let sec = 30 + (diff === "medium" ? 30 : diff === "hard" ? 60 : 0);
        return `${sec} seconds`;
    }

    let reps = 10 + (diff === "medium" ? 5 : diff === "hard" ? 10 : 0);
    return `${reps} reps`;
}

function generateSuggestions() {
    const diff = document.getElementById("difficulty").value;
    const type = document.getElementById("workoutType").value;
    const box = document.getElementById("suggestedListContainer");

    box.innerHTML = "";

    WORKOUT_DB[type].forEach(ex => {
        const reps = getRepsFor(ex, diff);

        const div = document.createElement("div");
        div.className = "suggested-item";
        div.dataset.type = ex;
        div.dataset.reps = reps;

        div.innerHTML = `
            <span>${reps} — ${ex}</span>
            <button class="suggest-btn">Add</button>
        `;

        box.appendChild(div);
    });

    attachSuggestedButtons();
}

document.getElementById("regenBtn").addEventListener("click", generateSuggestions);
document.getElementById("difficulty").addEventListener("change", generateSuggestions);
document.getElementById("workoutType").addEventListener("change", generateSuggestions);

generateSuggestions();
renderWorkouts();

/* ---------- LOGOUT (FRONTEND SAFE) ---------- */
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token"); // harmless
        alert("Logged out (frontend only)");
    });
}
