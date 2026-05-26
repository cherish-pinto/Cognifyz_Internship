class App {
  constructor() {
    this.formData = [];
    this.initEventListeners();
    this.updateUI();
  }

  initEventListeners() {
    document.getElementById('dataForm').addEventListener('submit', (e) => this.handleFormSubmit(e));
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    if (!authManager.isAuthenticated()) {
      this.showMessage('form-message', 'Please login first', 'error');
      return;
    }

    const formData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      message: document.getElementById('message').value
    };

    try {
      const response = await fetch(`${API_URL}/form/submit`, {
        method: 'POST',
        headers: authManager.getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        this.showMessage('form-message', 'Form submitted successfully!', 'success');
        document.getElementById('dataForm').reset();
        this.loadFormData();
      } else {
        this.showMessage('form-message', data.message || 'Error submitting form', 'error');
      }
    } catch (err) {
      this.showMessage('form-message', 'Error submitting form', 'error');
    }
  }

  async loadFormData() {
    if (!authManager.isAuthenticated()) return;

    try {
      const response = await fetch(`${API_URL}/form/data`, {
        method: 'GET',
        headers: authManager.getAuthHeaders()
      });

      if (response.ok) {
        this.formData = await response.json();
        this.displayFormData();
      }
    } catch (err) {
      console.error('Error loading form data:', err);
    }
  }

  displayFormData() {
    const container = document.getElementById('data-list');
    
    if (this.formData.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #9ca3af;">No data submitted yet</p>';
      return;
    }

    container.innerHTML = this.formData.map(item => `
      <div class="data-item">
        <h3>${item.firstName} ${item.lastName}</h3>
        <p><strong>Email:</strong> ${item.email}</p>
        <p><strong>Phone:</strong> ${item.phone}</p>
        <p><strong>Message:</strong> ${item.message}</p>
        <small>Submitted: ${new Date(item.createdAt).toLocaleDateString()}</small>
        <div class="data-item-actions">
          <button class="btn-delete" onclick="app.deleteFormData('${item._id}')">Delete</button>
        </div>
      </div>
    `).join('');
  }

  async deleteFormData(id) {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const response = await fetch(`${API_URL}/form/data/${id}`, {
        method: 'DELETE',
        headers: authManager.getAuthHeaders()
      });

      if (response.ok) {
        this.showMessage('form-message', 'Entry deleted successfully', 'success');
        this.loadFormData();
      } else {
        this.showMessage('form-message', 'Error deleting entry', 'error');
      }
    } catch (err) {
      this.showMessage('form-message', 'Error deleting entry', 'error');
    }
  }

  showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `message show ${type}`;
    setTimeout(() => {
      element.classList.remove('show');
    }, 3000);
  }

  updateUI() {
    authManager.updateUI();
    if (authManager.isAuthenticated()) {
      this.loadFormData();
    }
  }
}

const app = new App();

authManager.updateUI();
