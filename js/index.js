// Tab Switching for nav links
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        sections.forEach(sec => sec.classList.remove('active-section'));
        navLinks.forEach(l => l.classList.remove('active'));

        const target = document.querySelector(link.getAttribute('href'));
        target.classList.add('active-section');
        link.classList.add('active');
    });
});

// Show login section after Get Started
const getStartedBtn = document.querySelector('.get-started-btn');
const heroSection = document.getElementById('home');
const loginSection = document.getElementById('login');

getStartedBtn.addEventListener('click', () => {
    heroSection.classList.remove('active-section');
    loginSection.classList.add('active-section');
    navLinks.forEach(l => l.classList.remove('active'));
});

// Login/Register form toggling (stacked vertically)
const showLoginFormBtn = document.getElementById('showLoginForm');
const showRegisterFormBtn = document.getElementById('showRegisterForm');

const loginOptions = document.getElementById('loginOptions');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

showLoginFormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginOptions.style.display = 'none';
    loginForm.style.display = 'block';
});

showRegisterFormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginOptions.style.display = 'none';
    registerForm.style.display = 'block';
});

// Go back to options
const backForms = [loginForm, registerForm];
backForms.forEach(form => {
    form.addEventListener('submit', (e) => e.preventDefault()); // prevent submission
});

// Optional demo alerts
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Login successful! (Front-end demo)');
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Registration successful! (Front-end demo)');
});
const showRegisterFromLogin = document.getElementById('showRegisterFromLogin');

showRegisterFromLogin.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});





