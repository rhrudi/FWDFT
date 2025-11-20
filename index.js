// Load workouts from localStorage
document.addEventListener("DOMContentLoaded", loadWorkouts);

function addWorkout() {
    const name = document.getElementById("workoutName").value;
    const reps = document.getElementById("workoutReps").value;

    if (name.trim() === "" || reps.trim() === "") {
        alert("Please fill out all fields!");
        return;
    }

    const workout = { name, reps };

    let workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    workouts.push(workout);
    localStorage.setItem("workouts", JSON.stringify(workouts));

    document.getElementById("workoutName").value = "";
    document.getElementById("workoutReps").value = "";

    loadWorkouts();
}

function loadWorkouts() {
    const list = document.getElementById("workoutList");
    list.innerHTML = "";

    let workouts = JSON.parse(localStorage.getItem("workouts")) || [];

    workouts.forEach((workout, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${workout.name} - ${workout.reps} reps
            <button class="delete-btn" onclick="deleteWorkout(${index})">X</button>
        `;
        list.appendChild(li);
    });
}

function deleteWorkout(index) {
    let workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    workouts.splice(index, 1);
    localStorage.setItem("workouts", JSON.stringify(workouts));
    loadWorkouts();
}
