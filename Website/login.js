// Login page JavaScript

// Handle login form submission
async function handleLogin(event) {
	event.preventDefault();

	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	const loginBtn = document.getElementById('login-btn');
	const errorDiv = document.getElementById('login-error');

	// Disable button and show loading state
	loginBtn.disabled = true;
	loginBtn.textContent = 'Logging in...';
	errorDiv.style.display = 'none';

	try {
		const response = await fetch('http://localhost:3000/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include', // Important for cookies/session
			body: JSON.stringify({ username, password })
		});

		const data = await response.json();

		if (response.ok && data.success) {
			// Login successful - redirect to admin page
			window.location.href = '/admin.html';
		} else {
			// Login failed - show error
			showError(data.message || 'Login failed. Please check your credentials.');
			loginBtn.disabled = false;
			loginBtn.textContent = 'Login';
		}
	} catch (error) {
		console.error('Login error:', error);
		showError('Network error. Please make sure the server is running.');
		loginBtn.disabled = false;
		loginBtn.textContent = 'Login';
	}
}

// Show error message
function showError(message) {
	const errorDiv = document.getElementById('login-error');
	errorDiv.textContent = message;
	errorDiv.style.display = 'block';
}

// Check if already logged in on page load
window.addEventListener('load', async function() {
	try {
		const response = await fetch('http://localhost:3000/api/auth/session', {
			credentials: 'include'
		});

		const data = await response.json();

		if (data.authenticated) {
			// Already logged in - redirect to admin
			window.location.href = '/admin.html';
		}
	} catch (error) {
		console.error('Session check error:', error);
	}
});
