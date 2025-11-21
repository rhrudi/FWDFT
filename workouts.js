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

    // Get current date & time
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    // Create card
    const card = document.createElement('div');
    card.classList.add('workout-card');
    card.innerHTML = `
        <h2>${type}</h2>
        <p>${reps}</p>
        <p class="timestamp">Logged on: ${date} at ${time}</p>
    `;

    container.appendChild(card);

    // Clear inputs
    document.getElementById('exerciseType').selectedIndex = 0;
    document.getElementById('workoutReps').value = '';

    // Suggested workouts click-to-fill
const suggestions = document.querySelectorAll('#suggestedList li');

suggestions.forEach(item => {
    item.addEventListener('click', () => {
        const type = item.getAttribute('data-type');
        const reps = item.getAttribute('data-reps');

        document.getElementById('exerciseType').value = type;
        document.getElementById('workoutReps').value = reps;
    });
});

});
