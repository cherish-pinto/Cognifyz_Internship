class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    }

    register(route, callback) {
        this.routes.set(route, callback);
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || '/register';
        const route = '/' + hash.split('/')[1];
        
        if (this.routes.has(route)) {
            this.currentRoute = route;
            this.routes.get(route)();
            this.updateNavigation();
        }
    }

    updateNavigation() {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + this.currentRoute) {
                link.classList.add('active');
            }
        });
    }
}

class FormValidator {
    constructor() {
        this.rules = {};
    }

    addRule(fieldName, rule) {
        if (!this.rules[fieldName]) {
            this.rules[fieldName] = [];
        }
        this.rules[fieldName].push(rule);
    }

    validate(fieldName, value) {
        if (!this.rules[fieldName]) {
            return { valid: true, message: '' };
        }

        for (const rule of this.rules[fieldName]) {
            const result = rule(value);
            if (!result.valid) {
                return result;
            }
        }

        return { valid: true, message: '' };
    }

    validateAll(formData) {
        const results = {};
        for (const [fieldName, value] of Object.entries(formData)) {
            results[fieldName] = this.validate(fieldName, value);
        }
        return results;
    }
}

const usernameRule = (value) => {
    if (value.length < 3) {
        return { valid: false, message: 'Username must be at least 3 characters' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
    }
    return { valid: true, message: 'Username is valid' };
};

const emailRule = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    return { valid: true, message: 'Email is valid' };
};

const passwordRule = (value) => {
    if (value.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters' };
    }
    if (!/[a-z]/.test(value)) {
        return { valid: false, message: 'Password must contain lowercase letters' };
    }
    if (!/[A-Z]/.test(value)) {
        return { valid: false, message: 'Password must contain uppercase letters' };
    }
    if (!/[0-9]/.test(value)) {
        return { valid: false, message: 'Password must contain numbers' };
    }
    if (!/[!@#$%^&*]/.test(value)) {
        return { valid: false, message: 'Password must contain special characters (!@#$%^&*)' };
    }
    return { valid: true, message: 'Password is strong' };
};

const phoneRule = (value) => {
    const phoneRegex = /^[\d\-\+\(\)\s]+$/;
    if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
        return { valid: false, message: 'Please enter a valid phone number' };
    }
    return { valid: true, message: 'Phone number is valid' };
};

const confirmPasswordRule = (confirmValue, password) => {
    if (confirmValue !== password) {
        return { valid: false, message: 'Passwords do not match' };
    }
    return { valid: true, message: 'Passwords match' };
};

const termsRule = (checked) => {
    if (!checked) {
        return { valid: false, message: 'You must agree to the terms and conditions' };
    }
    return { valid: true, message: '' };
};

function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    
    if (strength <= 2) return { level: 'weak', text: 'Password strength: Weak' };
    if (strength <= 3) return { level: 'fair', text: 'Password strength: Fair' };
    if (strength <= 4) return { level: 'good', text: 'Password strength: Good' };
    return { level: 'strong', text: 'Password strength: Strong' };
}

function updatePasswordStrengthIndicator(password) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    if (!password) {
        strengthBar.className = 'strength-bar';
        strengthText.textContent = 'Password strength: None';
        return;
    }
    
    const strength = calculatePasswordStrength(password);
    strengthBar.className = `strength-bar ${strength.level}`;
    strengthText.textContent = strength.text;
}

function updateFieldDisplay(fieldName, isValid, message) {
    const input = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    const successElement = document.getElementById(`${fieldName}-success`);
    
    if (!input) return;
    
    if (isValid) {
        input.classList.remove('error');
        input.classList.add('success');
        if (errorElement) errorElement.textContent = '';
        if (successElement) successElement.textContent = message;
    } else {
        input.classList.remove('success');
        input.classList.add('error');
        if (errorElement) errorElement.textContent = message;
        if (successElement) successElement.textContent = '';
    }
}

function clearFieldDisplay(fieldName) {
    const input = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    const successElement = document.getElementById(`${fieldName}-success`);
    
    if (!input) return;
    
    input.classList.remove('error', 'success');
    if (errorElement) errorElement.textContent = '';
    if (successElement) successElement.textContent = '';
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    const modalMessage = document.getElementById('modalMessage');
    if (modalMessage) modalMessage.textContent = message;
    modal.classList.add('show');
}

function hideModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
}

document.addEventListener('DOMContentLoaded', () => {
    const validator = new FormValidator();
    
    validator.addRule('username', usernameRule);
    validator.addRule('email', emailRule);
    validator.addRule('password', passwordRule);
    validator.addRule('phone', phoneRule);
    validator.addRule('terms', termsRule);
    
    const router = new Router();
    
    router.register('/register', () => {
        showPage('register-page');
    });
    
    router.register('/profile', () => {
        showPage('profile-page');
        displayProfileData();
    });
    
    router.register('/settings', () => {
        showPage('settings-page');
    });
    
    const form = document.getElementById('registrationForm');
    
    const usernameInput = document.getElementById('username');
    usernameInput.addEventListener('blur', () => {
        const result = validator.validate('username', usernameInput.value);
        updateFieldDisplay('username', result.valid, result.message);
    });
    
    usernameInput.addEventListener('input', () => {
        if (usernameInput.value) {
            clearFieldDisplay('username');
        }
    });
    
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', () => {
        const result = validator.validate('email', emailInput.value);
        updateFieldDisplay('email', result.valid, result.message);
    });
    
    emailInput.addEventListener('input', () => {
        if (emailInput.value) {
            clearFieldDisplay('email');
        }
    });
    
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', () => {
        updatePasswordStrengthIndicator(passwordInput.value);
        clearFieldDisplay('password');
    });
    
    passwordInput.addEventListener('blur', () => {
        const result = validator.validate('password', passwordInput.value);
        updateFieldDisplay('password', result.valid, result.message);
    });
    
    const confirmPasswordInput = document.getElementById('confirmPassword');
    confirmPasswordInput.addEventListener('blur', () => {
        const result = confirmPasswordRule(confirmPasswordInput.value, passwordInput.value);
        updateFieldDisplay('confirmPassword', result.valid, result.message);
    });
    
    confirmPasswordInput.addEventListener('input', () => {
        if (confirmPasswordInput.value) {
            clearFieldDisplay('confirmPassword');
        }
    });
    
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('blur', () => {
        const result = validator.validate('phone', phoneInput.value);
        updateFieldDisplay('phone', result.valid, result.message);
    });
    
    phoneInput.addEventListener('input', () => {
        if (phoneInput.value) {
            clearFieldDisplay('phone');
        }
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            username: usernameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            confirmPassword: confirmPasswordInput.value,
            phone: phoneInput.value,
            terms: document.getElementById('terms').checked
        };
        
        const validationResults = validator.validateAll(formData);
        
        updateFieldDisplay('username', validationResults.username.valid, validationResults.username.message);
        updateFieldDisplay('email', validationResults.email.valid, validationResults.email.message);
        updateFieldDisplay('password', validationResults.password.valid, validationResults.password.message);
        
        const confirmResult = confirmPasswordRule(formData.confirmPassword, formData.password);
        updateFieldDisplay('confirmPassword', confirmResult.valid, confirmResult.message);
        
        updateFieldDisplay('phone', validationResults.phone.valid, validationResults.phone.message);
        
        const termsElement = document.getElementById('terms');
        const termsResult = validator.validate('terms', termsElement.checked);
        const termsError = document.getElementById('terms-error');
        if (termsError) termsError.textContent = termsResult.message;
        
        const allValid = 
            validationResults.username.valid &&
            validationResults.email.valid &&
            validationResults.password.valid &&
            confirmResult.valid &&
            validationResults.phone.valid &&
            termsResult.valid;
        
        if (allValid) {
            const userData = {
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                registrationDate: new Date().toLocaleDateString()
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            
            showSuccessModal('Account created successfully! You can now view your profile.');
            
            form.reset();
            document.getElementById('strengthBar').className = 'strength-bar';
            document.getElementById('strengthText').textContent = 'Password strength: None';
            document.querySelectorAll('.form-group input').forEach(input => {
                clearFieldDisplay(input.id);
            });
        }
    });
    
    const modalOkBtn = document.getElementById('modalOkBtn');
    modalOkBtn.addEventListener('click', () => {
        hideModal();
        window.location.hash = '#/profile';
    });
    
    const closeModal = document.querySelector('.close-modal');
    closeModal.addEventListener('click', hideModal);
    
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('successModal');
        if (e.target === modal) {
            hideModal();
        }
    });
    
    function displayProfileData() {
        const profileContent = document.getElementById('profileContent');
        const userData = localStorage.getItem('userData');
        
        if (userData) {
            const data = JSON.parse(userData);
            profileContent.innerHTML = `
                <div class="profile-data">
                    <div class="data-row">
                        <strong>Username:</strong>
                        <span>${data.username}</span>
                    </div>
                    <div class="data-row">
                        <strong>Email:</strong>
                        <span>${data.email}</span>
                    </div>
                    <div class="data-row">
                        <strong>Phone:</strong>
                        <span>${data.phone}</span>
                    </div>
                    <div class="data-row">
                        <strong>Registration Date:</strong>
                        <span>${data.registrationDate}</span>
                    </div>
                </div>
            `;
        } else {
            profileContent.innerHTML = '<p class="placeholder">No profile data. Please register first.</p>';
        }
    }
    
    const clearProfileBtn = document.getElementById('clearProfile');
    clearProfileBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your profile?')) {
            localStorage.removeItem('userData');
            displayProfileData();
        }
    });
    
    const deleteAccountBtn = document.getElementById('deleteAccount');
    deleteAccountBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            localStorage.removeItem('userData');
            showSuccessModal('Account deleted successfully.');
            setTimeout(() => {
                hideModal();
                window.location.hash = '#/register';
            }, 2000);
        }
    });
    
    const notificationToggle = document.getElementById('notificationToggle');
    const savedNotification = localStorage.getItem('notificationsEnabled');
    if (savedNotification) notificationToggle.checked = JSON.parse(savedNotification);
    
    notificationToggle.addEventListener('change', () => {
        localStorage.setItem('notificationsEnabled', notificationToggle.checked);
    });
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
        darkModeToggle.checked = JSON.parse(savedDarkMode);
        if (darkModeToggle.checked) {
            document.body.classList.add('dark-mode');
        }
    }
    
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', darkModeToggle.checked);
    });
});
