// Tab Switching
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active classes
        sections.forEach(sec => sec.classList.remove('active-section'));
        navLinks.forEach(l => l.classList.remove('active'));

        // Add active class to clicked tab & corresponding section
        const target = document.querySelector(link.getAttribute('href'));
        target.classList.add('active-section');
        link.classList.add('active');
    });
});

// Workout Tracker
const workoutList = document.getElementById('workoutList');

function addWorkout() {
    const name = document.getElementById('workoutName').value.trim();
    const reps = document.getElementById('workoutReps').value.trim();

    if (name === "" || reps === "") {
        alert("Please enter workout name and reps.");
        return;
    }

    const li = document.createElement('li');
    li.textContent = `${name} - ${reps} reps`;
    workoutList.appendChild(li);

    // Clear inputs
    document.getElementById('workoutName').value = '';
    document.getElementById('workoutReps').value = '';
}

