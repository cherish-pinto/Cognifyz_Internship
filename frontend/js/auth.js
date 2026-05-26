const API_URL = 'http://localhost:5000/api';

class AuthManager {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user')) || null;
    this.initEventListeners();
  }

  initEventListeners() {
    document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
    document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
    document.getElementById('login-tab').addEventListener('click', () => this.switchTab('login'));
    document.getElementById('register-tab').addEventListener('click', () => this.switchTab('register'));
    document.getElementById('logout-btn').addEventListener('click', () => this.logout());
  }

  switchTab(tab) {
    document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
    document.getElementById('register-form').classList.toggle('hidden', tab !== 'register');
    document.getElementById('login-tab').classList.toggle('active', tab === 'login');
    document.getElementById('register-tab').classList.toggle('active', tab === 'register');
  }

  async handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        this.showMessage('login-message', 'Login successful!', 'success');
        setTimeout(() => this.updateUI(), 500);
      } else {
        this.showMessage('login-message', data.message || 'Login failed', 'error');
      }
    } catch (err) {
      this.showMessage('login-message', 'Error connecting to server', 'error');
    }
  }

  async handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        this.showMessage('register-message', 'Registration successful!', 'success');
        setTimeout(() => this.updateUI(), 500);
      } else {
        this.showMessage('register-message', data.message || 'Registration failed', 'error');
      }
    } catch (err) {
      this.showMessage('register-message', 'Error connecting to server', 'error');
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
    document.getElementById('login-message').textContent = '';
    document.getElementById('register-message').textContent = '';
    this.updateUI();
  }

  showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `message show ${type}`;
  }

  updateUI() {
    const authContainer = document.getElementById('auth-container');
    const dashboardContainer = document.getElementById('dashboard-container');

    if (this.isAuthenticated()) {
      authContainer.classList.add('hidden');
      dashboardContainer.classList.remove('hidden');
    } else {
      authContainer.classList.remove('hidden');
      dashboardContainer.classList.add('hidden');
    }
  }

  isAuthenticated() {
    return this.token !== null;
  }

  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }
}

const authManager = new AuthManager();
