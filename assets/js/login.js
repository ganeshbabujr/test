document.addEventListener('DOMContentLoaded', function () {
  // ==============================
  // Config
  // ==============================
  const AUTH_CONFIG = {
    validCredentials: [
      { email: "jr.ganesh66@gmail.com", password: "Dwaraka", name: "Ganesh" },
      { email: "j.indhu66@gmail.com", password: "Dwaraka", name: "Indhu" },
      { email: "others@gmail.com", password: "user@2025", name: "Regular User" }
    ],
    authKey: 'sqlmaster-auth',
    userDataKey: 'sqlmaster-userdata'
  };

  // ==============================
  // Utility Functions
  // ==============================
  function showToast(message, type = '') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validateCredentials(email, password) {
    return AUTH_CONFIG.validCredentials.find(user =>
      user.email === email && user.password === password
    );
  }

  function showDashboard(user) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('accountDashboard').style.display = 'block';

    const nameEl = document.querySelector('.user-info h3');
    const emailEl = document.querySelector('.user-info p');
    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
  }

  function checkAuthState() {
    const isAuthenticated = localStorage.getItem(AUTH_CONFIG.authKey) === 'true';
    const userData = JSON.parse(localStorage.getItem(AUTH_CONFIG.userDataKey));
    if (isAuthenticated && userData) {
      showDashboard(userData);
    }
  }

  // ==============================
  // Login
  // ==============================
  function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;

    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Invalid email format', 'error');
      return;
    }

    const user = validateCredentials(email, password);
    if (user) {
      localStorage.setItem(AUTH_CONFIG.authKey, 'true');
      localStorage.setItem(AUTH_CONFIG.userDataKey, JSON.stringify(user));
      showToast('Login successful!', 'success');
      showDashboard(user);
    } else {
      showToast('Invalid credentials', 'error');
    }
  }

  // ==============================
  // Registration
  // ==============================
  function handleRegistration(e) {
    e.preventDefault();
    const name = document.getElementById('registerName')?.value.trim();
    const email = document.getElementById('registerEmail')?.value.trim();
    const password = document.getElementById('registerPassword')?.value;
    const confirm = document.getElementById('registerConfirm')?.value;

    if (!name || !email || !password || !confirm) {
      showToast('All fields are required', 'error');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Invalid email format', 'error');
      return;
    }

    if (password.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }

    if (password !== confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (AUTH_CONFIG.validCredentials.some(user => user.email === email)) {
      showToast('Email already registered', 'error');
      return;
    }

    const newUser = { email, password, name };
    AUTH_CONFIG.validCredentials.push(newUser);
    showToast('Registration successful! Please login.', 'success');

    document.getElementById('registerForm').reset();
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
  }

  // ==============================
  // Logout
  // ==============================
  function handleLogout() {
    localStorage.removeItem(AUTH_CONFIG.authKey);
    localStorage.removeItem(AUTH_CONFIG.userDataKey);
    showToast('Logged out successfully', 'success');
    document.getElementById('accountDashboard').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
  }

  // ==============================
  // Password Visibility Toggle
  // ==============================
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
      btn.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
  });

  // ==============================
  // Password Strength Checker
  // ==============================
  const passwordInput = document.getElementById('registerPassword');
  if (passwordInput) {
    passwordInput.addEventListener('input', function () {
      const bar = document.querySelector('.strength-bar');
      const text = document.querySelector('.strength-text');
      const pwd = this.value;

      let strength = 0;
      if (pwd.length >= 8) strength++;
      if (/[A-Z]/.test(pwd)) strength++;
      if (/[0-9]/.test(pwd)) strength++;
      if (/[^A-Za-z0-9]/.test(pwd)) strength++;

      const width = strength * 25;
      bar.style.width = `${width}%`;

      if (strength <= 1) {
        bar.style.backgroundColor = '#ef4444';
        text.textContent = 'Weak';
      } else if (strength <= 3) {
        bar.style.backgroundColor = '#f59e0b';
        text.textContent = 'Medium';
      } else {
        bar.style.backgroundColor = '#10b981';
        text.textContent = 'Strong';
      }
    });
  }

  // ==============================
  // Init Event Listeners
  // ==============================
  const loginForm = document.getElementById('login');
  const registerForm = document.getElementById('register');
  const logoutBtn = document.getElementById('logoutBtn');

  if (loginForm) loginForm.addEventListener('submit', handleLogin);
 // Comment out this line to disable registration
// if (registerForm) registerForm.addEventListener('submit', handleRegistration);

  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

  const showRegister = document.getElementById('showRegister');
  const showLogin = document.getElementById('showLogin');



// if (showRegister)
//   showRegister.addEventListener('click', (e) => {
//     e.preventDefault();
//     document.getElementById('loginForm').style.display = 'none';
//     document.getElementById('registerForm').style.display = 'block';
//   });




  if (showLogin)
    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('registerForm').style.display = 'none';
      document.getElementById('loginForm').style.display = 'block';
    });

  // ==============================
  // Start App
  // ==============================
  checkAuthState();
});
