// public/auth.js

// Helpers
function showTasksUI() {
    document.getElementById('auth-ui').style.display = 'none';
    document.getElementById('tasks-ui').style.display = 'block';
  }
  function showAuthUI() {
    document.getElementById('tasks-ui').style.display = 'none';
    document.getElementById('auth-ui').style.display = 'block';
  }
  
  // On page load, check for token
  document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      showTasksUI();
      // assume fetchTasks is global (from app.js)
      if (typeof fetchTasks === 'function') fetchTasks();
    } else {
      showAuthUI();
    }
  });
  
  
  // SIGNUP
  async function signup(e) {
    e.preventDefault();
    const email    = signupEmail.value;
    const password = signupPassword.value;
  
    const res = await fetch('/api/signup', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password })
    });
  
    const data = await res.json();
    alert(data.message);
  }
  
  // LOGIN
  async function login(e) {
    e.preventDefault();
    const email    = loginEmail.value;
    const password = loginPassword.value;
  
    const res = await fetch('/api/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password })
    });
  
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      showTasksUI();
      if (typeof fetchTasks === 'function') fetchTasks();
    } else {
      alert(data.message || 'Login failed');
    }
  }
  
  // LOGOUT
  function logout() {
    localStorage.removeItem('authToken');
    showAuthUI();
  }
  
  signupForm.addEventListener('submit', signup);
  loginForm.addEventListener('submit', login);
  logout.addEventListener('click', logout);
  