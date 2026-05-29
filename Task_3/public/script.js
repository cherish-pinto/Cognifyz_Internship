const API_URL = 'http://localhost:5000/api';

let currentUser = null;
let isSignUp = false;

const authContainer = document.getElementById('authContainer');
const mainContainer = document.getElementById('mainContainer');
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const usernameField = document.getElementById('usernameField');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const dataForm = document.getElementById('dataForm');
const submissionsList = document.getElementById('submissionsList');

function init() {
    const token = localStorage.getItem('token');
    if (token) {
        currentUser = JSON.parse(localStorage.getItem('user'));
        showMainContainer();
        loadSubmissions();
    }
}

function showAuthContainer() {
    authContainer.classList.remove('hidden');
    mainContainer.classList.add('hidden');
}

function showMainContainer() {
    authContainer.classList.add('hidden');
    mainContainer.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    userInfo.classList.remove('hidden');
    userInfo.textContent = `Welcome, ${currentUser.username}!`;
}

function handleToggleAuth(e) {
    e.preventDefault();
    isSignUp = !isSignUp;
    
    if (isSignUp) {
        authTitle.textContent = 'Sign Up';
        usernameField.classList.remove('hidden');
        authForm.querySelector('button').textContent = 'Sign Up';
        document.querySelector('.toggle-auth').innerHTML = 'Already have an account? <a href="#" class="toggle-link">Login</a>';
    } else {
        authTitle.textContent = 'Login';
        usernameField.classList.add('hidden');
        authForm.querySelector('button').textContent = 'Login';
        document.querySelector('.toggle-auth').innerHTML = 'Don\'t have an account? <a href="#" class="toggle-link">Sign up</a>';
    }
    
    authForm.reset();
}

document.querySelector('.toggle-auth').addEventListener('click', (e) => {
    if (e.target.classList.contains('toggle-link')) {
        handleToggleAuth(e);
    }
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    const endpoint = isSignUp ? '/auth/signup' : '/auth/login';
    let payload = { email, password };
    
    if (isSignUp) {
        const username = document.getElementById('username').value;
        if (!username) {
            showAlert('Please enter a username', 'error');
            return;
        }
        payload.username = username;
    }

    try {
        console.log('Sending request to:', API_URL + endpoint);
        console.log('Payload:', payload);
        
        const response = await fetch(API_URL + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
            showAlert(data.message || 'Authentication failed', 'error');
            return;
        }

        if (!data.token || !data.userId) {
            showAlert('Invalid server response', 'error');
            return;
        }

        localStorage.setItem('token', data.token);
        currentUser = { userId: data.userId, username: data.username || email };
        localStorage.setItem('user', JSON.stringify(currentUser));

        showAlert(isSignUp ? 'Account created successfully!' : 'Login successful!', 'success');
        authForm.reset();
        isSignUp = false;
        
        setTimeout(() => {
            showMainContainer();
            loadSubmissions();
        }, 500);
    } catch (error) {
        console.error('Error during auth:', error);
        showAlert('Network error: ' + error.message, 'error');
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    isSignUp = false;
    authForm.reset();
    document.getElementById('username').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    logoutBtn.classList.add('hidden');
    userInfo.classList.add('hidden');
    showAuthContainer();
});

dataForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('formName').value,
        email: document.getElementById('formEmail').value,
        message: document.getElementById('formMessage').value
    };

    try {
        const response = await fetch(API_URL + '/forms/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            showAlert(data.message || 'Form submission failed', 'error');
            return;
        }

        showAlert('Form submitted successfully!', 'success');
        dataForm.reset();
        loadSubmissions();
    } catch (error) {
        showAlert('Network error: ' + error.message, 'error');
    }
});

async function loadSubmissions() {
    try {
        const response = await fetch(API_URL + '/forms/my-submissions', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            showAlert(data.message || 'Failed to load submissions', 'error');
            return;
        }

        displaySubmissions(data.forms);
    } catch (error) {
        showAlert('Network error: ' + error.message, 'error');
    }
}

function displaySubmissions(forms) {
    if (!forms || forms.length === 0) {
        submissionsList.innerHTML = '<p class="empty-message">No submissions yet</p>';
        return;
    }

    submissionsList.innerHTML = forms.map(form => `
        <div class="submission-card">
            <div class="submission-header">
                <span class="submission-name">${escapeHtml(form.name)}</span>
                <span class="submission-date">${new Date(form.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="submission-email">${escapeHtml(form.email)}</div>
            <div class="submission-message">${escapeHtml(form.message)}</div>
            <button class="delete-btn" onclick="deleteSubmission('${form._id}')">Delete</button>
        </div>
    `).join('');
}

async function deleteSubmission(formId) {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
        const response = await fetch(API_URL + `/forms/${formId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            showAlert(data.message || 'Deletion failed', 'error');
            return;
        }

        showAlert('Submission deleted successfully!', 'success');
        loadSubmissions();
    } catch (error) {
        showAlert('Network error: ' + error.message, 'error');
    }
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    const container = currentUser ? mainContainer : authContainer;
    container.insertBefore(alert, container.firstChild);
    
    setTimeout(() => alert.remove(), 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

init();
