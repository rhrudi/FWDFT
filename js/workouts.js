console.log("WORKOUTS.JS LOADED");

const container = document.querySelector('.workout-cards');
const addBtn = document.getElementById('addWorkoutBtn');

const STORAGE_KEY = "fitrack_workouts_storage";

// RANDOMIZE SUGGESTED WORKOUT QUANTITIES
function randomizeSuggested() {
    const items = document.querySelectorAll('.suggested-item');

    items.forEach(item => {
        const type = item.dataset.type;
        let quantity = "";

        switch(type) {
            case "Push-ups":
                quantity = Math.floor(Math.random() * 21) + 10;  // 10–30
                item.dataset.reps = `${quantity} reps`;
                item.querySelector('span').textContent = `${quantity} × Push-ups`;
                break;

            case "Squats":
                quantity = Math.floor(Math.random() * 26) + 15; // 15–40
                item.dataset.reps = `${quantity} reps`;
                item.querySelector('span').textContent = `${quantity} × Squats`;
                break;

            case "Plank":
                const seconds = (Math.floor(Math.random() * 4) + 1) * 30; // 30–120 sec
                item.dataset.reps = `${seconds} seconds`;
                item.querySelector('span').textContent = `${seconds} sec Plank`;
                break;

            case "Lunges":
                quantity = Math.floor(Math.random() * 16) + 10; // 10–25
                item.dataset.reps = `${quantity} reps each leg`;
                item.querySelector('span').textContent = `${quantity} × Lunges`;
                break;

            case "Burpees":
                quantity = Math.floor(Math.random() * 16) + 5; // 5–20
                item.dataset.reps = `${quantity} reps`;
                item.querySelector('span').textContent = `${quantity} Burpees`;
                break;
        }
    });
}

randomizeSuggested();

function loadSavedWorkouts() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveWorkouts(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function renderSavedWorkouts() {
    const list = loadSavedWorkouts();
    container.innerHTML = "";

    list.forEach(w => {
        const card = document.createElement('div');
        card.classList.add('workout-card');
        card.innerHTML = `
            <h2>${w.type}</h2>
            <p>${w.reps}</p>
            <p class="timestamp">Logged on: ${w.date} at ${w.time}</p>
            <button class="delete-btn">Delete</button>
        `;

        container.appendChild(card);

        // Delete button
        card.querySelector('.delete-btn').addEventListener('click', () => {
            card.style.opacity = "0";
            setTimeout(() => {
                const updated = loadSavedWorkouts().filter(entry => !(entry.date === w.date && entry.time === w.time));
                saveWorkouts(updated);
                renderSavedWorkouts();
            }, 250);
        });
    });
}

renderSavedWorkouts();

document.querySelectorAll('.suggested-item').forEach(item => {
    const btn = item.querySelector('.suggest-btn');
    btn.addEventListener('click', () => {
        const type = item.dataset.type;
        const reps = item.dataset.reps;

        document.getElementById('exerciseType').value = type;
        document.getElementById('workoutReps').value = reps;
    });
});

const suggestions = document.querySelectorAll('#suggestedList li');

suggestions.forEach(item => {
    item.addEventListener('click', () => {
        const type = item.getAttribute('data-type');
        const reps = item.getAttribute('data-reps');

        document.getElementById('exerciseType').value = type;
        document.getElementById('workoutReps').value = reps;
    });
});

function shuffleSuggested() {
    const list = document.querySelector('.suggested-list');
    const items = Array.from(list.children);

    // Fisher-Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }

    // Re-add in random order
    list.innerHTML = "";
    items.forEach(i => list.appendChild(i));
}

shuffleSuggested();

// --------------------------------------
// Suggested workout "Add" button handler
// --------------------------------------
document.querySelectorAll('.suggested-item').forEach(item => {
    const btn = item.querySelector('.suggest-btn');
    btn.addEventListener('click', () => {
        document.getElementById('exerciseType').value = item.dataset.type;
        document.getElementById('workoutReps').value = item.dataset.reps;
    });
});

const WORKOUT_DB = {
    strength: [
        "Push-ups",
        "Squats",
        "Lunges",
        "Burpees",
        "Tricep Dips"
    ],
    cardio: [
        "Jumping Jacks",
        "High Knees",
        "Mountain Climbers",
        "Butt Kicks",
        "Skipping"
    ],
    core: [
        "Plank",
        "Crunches",
        "Leg Raises",
        "Bicycle Crunches",
        "Flutter Kicks"
    ]
};

function getRepsFor(exercise, difficulty, type) {
    let base;

    if (type === "core" && exercise === "Plank") {
        base = Math.floor(Math.random() * 4 + 2) * 15;  // 30–90 sec
        if (difficulty === "medium") base += 15;
        if (difficulty === "hard") base += 30;

        return `${base} seconds`;
    }

    base = Math.floor(Math.random() * 8) + 8; // 8–15 reps

    if (difficulty === "medium") base += 5;
    if (difficulty === "hard") base += 10;

    return `${base} reps`;
}

function generateSuggestions() {
    const difficulty = document.getElementById("difficulty").value;
    const type = document.getElementById("workoutType").value;

    const container = document.getElementById("suggestedListContainer");
    container.innerHTML = "";

    const exercises = WORKOUT_DB[type];

    for (let i = 0; i < 5; i++) {
        const ex = exercises[Math.floor(Math.random() * exercises.length)];
        const reps = getRepsFor(ex, difficulty, type);

        const item = document.createElement("div");
        item.className = "suggested-item";
        item.dataset.type = ex;
        item.dataset.reps = reps;

        item.innerHTML = `
            <span>${reps} — ${ex}</span>
            <button class="suggest-btn">Add</button>
        `;

        container.appendChild(item);
    }

    attachSuggestedButtons();
}

function attachSuggestedButtons() {
    document.querySelectorAll('.suggested-item .suggest-btn')
        .forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.closest('.suggested-item');
                const type = item.dataset.type;
                const reps = item.dataset.reps;

                addWorkoutDirect(type, reps);
            });
        });
}

document.getElementById("regenBtn").addEventListener("click", generateSuggestions);
document.getElementById("difficulty").addEventListener("change", generateSuggestions);
document.getElementById("workoutType").addEventListener("change", generateSuggestions);

generateSuggestions();

function addWorkoutDirect(type, reps) {
    const now = new Date();
    const entry = {
        type,
        reps,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString()
    };

    const list = loadSavedWorkouts();
    list.push(entry);
    saveWorkouts(list);

    renderSavedWorkouts();
}

addBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const type = document.getElementById('exerciseType').value;
    const reps = document.getElementById('workoutReps').value.trim();

    if (!type || !reps) {
        alert("Please select an exercise and enter reps or time.");
        return;
    }

    const now = new Date();
    const entry = {
        type,
        reps,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString()
    };

    const list = loadSavedWorkouts();
    list.push(entry);
    saveWorkouts(list);

    renderSavedWorkouts();

    document.getElementById('exerciseType').selectedIndex = 0;
    document.getElementById('workoutReps').value = '';
});
