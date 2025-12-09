function loadProgress() {
    const workouts = JSON.parse(localStorage.getItem("workouts")) || [];

    const total = workouts.length;
    const completed = workouts.filter(w => w.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    document.getElementById("totalWorkouts").textContent = total;
    document.getElementById("completedWorkouts").textContent = completed;
    document.getElementById("percentage").textContent = percent + "%";

    document.getElementById("progressBar").style.width = percent + "%";
}

loadProgress()