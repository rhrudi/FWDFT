// Tab Switching for nav links (only on index.html)
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');

if (navLinks.length > 0 && sections.length > 0) {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sections.forEach(sec => sec.classList.remove('active-section'));
            navLinks.forEach(l => l.classList.remove('active'));

            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.classList.add('active-section');
            link.classList.add('active');
        });
    });
}

// Show login section after Get Started
const getStartedBtn = document.querySelector('.get-started-btn');
const heroSection = document.getElementById('home');
const loginSection = document.getElementById('login');

if (getStartedBtn && heroSection && loginSection) {
    getStartedBtn.addEventListener('click', () => {
        heroSection.classList.remove('active-section');
        loginSection.classList.add('active-section');
        navLinks.forEach(l => l.classList.remove('active'));
    });
}

// Login/Register form toggling
const showLoginFormBtn = document.getElementById('showLoginForm');
const showRegisterFormBtn = document.getElementById('showRegisterForm');
const loginOptions = document.getElementById('loginOptions');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (showLoginFormBtn && loginOptions && loginForm) {
    showLoginFormBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginOptions.style.display = 'none';
        loginForm.style.display = 'block';
    });
}

if (showRegisterFormBtn && loginOptions && registerForm) {
    showRegisterFormBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginOptions.style.display = 'none';
        registerForm.style.display = 'block';
    });
}

// Prevent forms from submitting (only if forms exist)
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Login successful! (Front-end demo)');
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Registration successful! (Front-end demo)');
    });
}

// Register from Login link
const showRegisterFromLogin = document.getElementById('showRegisterFromLogin');
if (showRegisterFromLogin && loginForm && registerForm) {
    showRegisterFromLogin.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });
}
