window.addEventListener("load", loadProgress);

function loadProgress() {
    const workouts = JSON.parse(localStorage.getItem("workouts")) || [];

    const total = workouts.length;
    const completed = workouts.filter(
        w => w.completed === true || w.done === true
    ).length;

    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    animateNumber("totalWorkouts", total);
    animateNumber("completedWorkouts", completed);
    animateNumber("percentage", percent, true);

    updateCircle(percent);
    updateStreak(workouts);
}

/* ---------- CIRCULAR GRAPH ---------- */
function updateCircle(percent) {
    const degrees = (percent / 100) * 360;
    document.querySelector(".circle").style.background =
        `conic-gradient(#4CAF50 ${degrees}deg, #ddd ${degrees}deg)`;
}

/* ---------- NUMBER ANIMATION ---------- */
function animateNumber(id, finalValue, isPercent = false) {
    const element = document.getElementById(id);
    let current = 0;

    const timer = setInterval(() => {
        if (current >= finalValue) {
            element.textContent = isPercent ? finalValue + "%" : finalValue;
            clearInterval(timer);
        } else {
            element.textContent = isPercent ? current + "%" : current;
            current++;
        }
    }, 20);
}

/* ---------- STREAK FEATURE ---------- */
function updateStreak(workouts) {
    const today = new Date().toDateString();

    const completedToday = workouts.some(w =>
        (w.completed || w.done) &&
        w.completedOn &&
        new Date(w.completedOn).toDateString() === today
    );

    let streak = Number(localStorage.getItem("streak")) || 0;
    let lastDay = localStorage.getItem("lastCompletedDay");

    if (completedToday && lastDay !== today) {
        streak++;
        localStorage.setItem("streak", streak);
        localStorage.setItem("lastCompletedDay", today);
    }

    document.getElementById("streakCount").textContent = streak;
}

addExtras();

function addExtras() {
    const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    const completed = workouts.filter(w => w.completed);

    /* Avg per day */
    const days = Math.max(1, new Set(
        completed.map(w => new Date(w.completedOn).toDateString())
    ).size);

    document.getElementById("avgPerDay").textContent =
        (completed.length / days).toFixed(1);

    /* Last workout */
    /* Last workout (SAFE VERSION) */
if (completed.length > 0) {
    const last = completed
        .map(w => {
            if (w.completedOn) return new Date(w.completedOn);
            if (w.createdAt) return new Date(w.createdAt);
            return null;
        })
        .filter(d => d && !isNaN(d))
        .sort((a, b) => b - a)[0];

    document.getElementById("lastWorkout").textContent =
        last ? last.toLocaleDateString() : "—";
} else {
    document.getElementById("lastWorkout").textContent = "—";
}



    /* Consistency (random realistic) */
    document.getElementById("consistency").textContent =
        Math.min(100, completed.length * 12) + "%";

    /* Weekly goal */
    const weekly = completed.filter(w => {
        const d = new Date(w.completedOn);
        const now = new Date();
        return now - d < 7 * 24 * 60 * 60 * 1000;
    }).length;

    document.getElementById("goalFill").style.width =
        Math.min(100, (weekly / 5) * 100) + "%";

    /* Recent activity */
    const recentList = document.getElementById("recentList");
    recentList.innerHTML = "";

    completed.slice(-3).reverse().forEach(w => {
        const li = document.createElement("li");
        li.textContent = `${w.type} • ${w.reps}`;
        recentList.appendChild(li);
    });

    /* Motivation */
    const tips = [
        "Consistency beats intensity.",
        "Small workouts still count.",
        "Rest days are part of progress.",
        "Your future self will thank you.",
        "One workout closer to your goal."
    ];

    document.getElementById("motivationText").textContent =
        tips[Math.floor(Math.random() * tips.length)];
}

document.addEventListener("DOMContentLoaded", () => {
    const themeToggleBtn = document.getElementById("themeToggle");
    if (!themeToggleBtn) return;

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
        themeToggleBtn.textContent = "☀️";
    }

    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        themeToggleBtn.textContent = isDark ? "☀️" : "🌙";
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
});
