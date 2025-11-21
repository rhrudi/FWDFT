const container = document.querySelector('.workout-cards');
const addBtn = document.getElementById('addWorkoutBtn');

addBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const type = document.getElementById('exerciseType').value;
    const reps = document.getElementById('workoutReps').value.trim();

    if (!type || !reps) {
        alert("Please select an exercise and enter reps or time.");
        return;
    }

    const card = document.createElement('div');
    card.classList.add('workout-card');
    card.innerHTML = `
        <h2>${type}</h2>
        <p>${reps}</p>
    `;

    container.appendChild(card);

    // Clear inputs
    document.getElementById('exerciseType').value = '';
    document.getElementById('workoutReps').value = '';
});
