console.log("WORKOUTS.JS LOADED");

const container = document.querySelector(".workout-cards");
const addBtn = document.getElementById("addWorkoutBtn");

const API_URL = "http://localhost:5000/api/workouts";

// Check for token in URL (from Google Auth redirect)
const urlParams = new URLSearchParams(window.location.search);
const urlToken = urlParams.get("token");

if (urlToken) {
    localStorage.setItem("token", urlToken);
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
}

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

/* ---------- RANDOMIZE DEFAULT SUGGESTIONS ---------- */
function randomizeSuggested() {
    document.querySelectorAll(".suggested-item").forEach(item => {
        const type = item.dataset.type;
        // Skip if already populated (e.g. by generator) or if type is missing
        if (!type || item.querySelector("span").textContent) return;

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

/* ---------- UTILITIES ---------- */
async function loadWorkouts() {
    try {
        const res = await fetch(API_URL, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        renderWorkouts(data);
        return data;
    } catch (err) {
        console.error("Error loading workouts:", err);
        return [];
    }
}

/* ---------- RENDER WORKOUT CARDS ---------- */
function renderWorkouts(workouts) {
    container.innerHTML = "";

    workouts.forEach((w) => {
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
        card.querySelector(".done-btn").addEventListener("click", async () => {
            try {
                await fetch(`${API_URL}/${w._id}`, {
                    method: "PUT",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                loadWorkouts();
            } catch (err) {
                console.error("Error updating workout", err);
            }
        });

        // DELETE BUTTON
        card.querySelector(".delete-btn").addEventListener("click", async () => {
            if (!confirm("Are you sure?")) return;
            try {
                await fetch(`${API_URL}/${w._id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                loadWorkouts();
            } catch (err) {
                console.error("Error deleting workout", err);
            }
        });

        container.appendChild(card);
    });
}

/* ---------- ADD WORKOUT MANUALLY ---------- */
addBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const type = document.getElementById("exerciseType").value;
    const reps = document.getElementById("workoutReps").value.trim();

    if (!type || !reps) {
        alert("Please fill all fields");
        return;
    }

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ type, reps })
        });

        if (res.ok) {
            loadWorkouts();
            document.getElementById("exerciseType").selectedIndex = 0;
            document.getElementById("workoutReps").value = "";
        } else {
            alert("Failed to add workout");
        }
    } catch (err) {
        console.error("Error adding workout:", err);
    }
});

/* ---------- SUGGESTED WORKOUT ADD ---------- */
function attachSuggestedButtons() {
    document.querySelectorAll(".suggested-item .suggest-btn").forEach(btn => {
        // remove old listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener("click", async (e) => {
            const item = e.target.closest(".suggested-item");

            try {
                await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        type: item.dataset.type,
                        reps: item.dataset.reps
                    })
                });
                loadWorkouts();
            } catch (err) {
                console.error("Error adding suggested workout:", err);
            }
        });
    });
}
attachSuggestedButtons();

// Load initially
loadWorkouts();

/* ---------- AI-LIKE GENERATOR ---------- */
/* ---------- AI-LIKE GENERATOR ---------- */
// Expanded Database
const WORKOUT_DB = {
    strength: [
        "Push-ups", "Squats", "Lunges", "Burpees", "Tricep Dips",
        "Pull-ups", "Deadlifts", "Bench Press", "Shoulder Press", "Bicep Curls"
    ],
    cardio: [
        "Jumping Jacks", "High Knees", "Mountain Climbers", "Running", "Cycling",
        "Jump Rope", "Box Jumps", "Burpees", "Rowing", "Stair Climbing"
    ],
    core: [
        "Plank", "Crunches", "Leg Raises", "Russian Twists", "Bicycle Crunches",
        "Sit-ups", "Side Plank", "Flutter Kicks", "Mountain Climbers"
    ]
};

function getRepsFor(ex, diff) {
    if (ex.includes("Plank") || ex.includes("Running") || ex.includes("Cycling")) {
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

    // 1. Get all exercises for this type
    const allExercises = WORKOUT_DB[type];

    // 2. Shuffle array (Fisher-Yates)
    const shuffled = [...allExercises].sort(() => 0.5 - Math.random());

    // 3. Pick top 4
    const selected = shuffled.slice(0, 4);

    selected.forEach(ex => {
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


