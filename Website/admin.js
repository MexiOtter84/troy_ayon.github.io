// Admin dashboard JavaScript for managing bookings

// Check authentication on page load
window.addEventListener('load', async function() {
	try {
		const response = await fetch('http://localhost:3000/api/auth/session', {
			credentials: 'include'
		});

		const data = await response.json();

		if (!data.authenticated) {
			// Not logged in - redirect to login page
			window.location.href = '/login.html';
			return;
		}

		// User is authenticated - load bookings
		loadBookings();
	} catch (error) {
		console.error('Authentication check error:', error);
		window.location.href = '/login.html';
	}
});

// Handle logout
async function handleLogout() {
	if (!confirm('Are you sure you want to logout?')) {
		return;
	}

	try {
		const response = await fetch('http://localhost:3000/api/auth/logout', {
			method: 'POST',
			credentials: 'include'
		});

		const data = await response.json();

		if (response.ok && data.success) {
			// Logout successful - redirect to login page
			window.location.href = '/login.html';
		} else {
			alert('Failed to logout: ' + (data.error || 'Unknown error'));
		}
	} catch (error) {
		console.error('Logout error:', error);
		alert('Network error during logout');
	}
}

// Service names and prices mapping
const serviceInfo = {
	service_foil: { name: 'Foiling', price: 155 },
	service_hair_cut: { name: 'Hair Cut', price: 40 },
	service_balagge: { name: 'Balayage', price: 195 },
	service_all_over_color: { name: 'All Over Color', price: 130 },
	service_wash_and_style: { name: 'Wash & Style', price: 60 },
	service_brow_wax: { name: 'Brow Wax', price: 50 }
};

// Load all bookings from the API
async function loadBookings() {
	const loading = document.getElementById('loading');
	const errorMessage = document.getElementById('error-message');
	const bookingsTable = document.getElementById('bookings-table');
	const noBookings = document.getElementById('no-bookings');
	const bookingCount = document.getElementById('booking-count');

	// Show loading indicator
	loading.style.display = 'block';
	errorMessage.style.display = 'none';
	bookingsTable.style.display = 'none';
	noBookings.style.display = 'none';

	try {
		const response = await fetch('http://localhost:3000/api/bookings', {
			credentials: 'include'
		});
		const data = await response.json();

		loading.style.display = 'none';

		if (response.ok && data.success) {
			const bookings = data.bookings;

			if (bookings.length === 0) {
				noBookings.style.display = 'block';
				bookingCount.textContent = 'Total Bookings: 0';
			} else {
				bookingsTable.style.display = 'table';
				bookingCount.textContent = `Total Bookings: ${bookings.length}`;
				displayBookings(bookings);
			}
		} else {
			showError('Failed to load bookings: ' + (data.error || 'Unknown error'));
		}
	} catch (error) {
		loading.style.display = 'none';
		showError('Network error: Unable to connect to the server. Make sure the server is running on port 3000.');
		console.error('Error loading bookings:', error);
	}
}

// Display bookings in the table
function displayBookings(bookings) {
	const tbody = document.getElementById('bookings-tbody');
	tbody.innerHTML = ''; // Clear existing rows

	bookings.forEach(booking => {
		const row = createBookingRow(booking);
		tbody.appendChild(row);
	});
}

// Create a table row for a booking
function createBookingRow(booking) {
	const row = document.createElement('tr');

	// ID column
	const idCell = document.createElement('td');
	idCell.textContent = booking.id;
	idCell.className = 'booking-id';
	row.appendChild(idCell);

	// Date column
	const dateCell = document.createElement('td');
	dateCell.textContent = formatDate(booking.created_at);
	row.appendChild(dateCell);

	// First name column
	const firstNameCell = document.createElement('td');
	firstNameCell.textContent = booking.first_name;
	row.appendChild(firstNameCell);

	// Last name column
	const lastNameCell = document.createElement('td');
	lastNameCell.textContent = booking.last_name;
	row.appendChild(lastNameCell);

	// Phone column
	const phoneCell = document.createElement('td');
	phoneCell.textContent = booking.phone;
	row.appendChild(phoneCell);

	// Services column
	const servicesCell = document.createElement('td');
	servicesCell.className = 'services-cell';
	const services = getSelectedServices(booking);
	servicesCell.innerHTML = services.join('<br>');
	row.appendChild(servicesCell);

	// Total cost column
	const costCell = document.createElement('td');
	costCell.textContent = '$' + booking.total_cost;
	costCell.className = 'cost-cell';
	row.appendChild(costCell);

	// Preferences column
	const preferencesCell = document.createElement('td');
	preferencesCell.textContent = booking.preferences;
	preferencesCell.className = 'preferences-cell';
	row.appendChild(preferencesCell);

	// Actions column
	const actionsCell = document.createElement('td');
	actionsCell.className = 'actions-cell';

	const editBtn = document.createElement('button');
	editBtn.textContent = 'Edit';
	editBtn.className = 'edit-btn';
	editBtn.onclick = () => openEditModal(booking);

	const deleteBtn = document.createElement('button');
	deleteBtn.textContent = 'Delete';
	deleteBtn.className = 'delete-btn';
	deleteBtn.onclick = () => deleteBooking(booking.id);

	actionsCell.appendChild(editBtn);
	actionsCell.appendChild(deleteBtn);
	row.appendChild(actionsCell);

	return row;
}

// Get list of selected services for a booking
function getSelectedServices(booking) {
	const services = [];

	for (const [key, info] of Object.entries(serviceInfo)) {
		if (booking[key] === 1) {
			services.push(`${info.name} ($${info.price})`);
		}
	}

	return services.length > 0 ? services : ['No services selected'];
}

// Format date string
function formatDate(dateString) {
	const date = new Date(dateString);
	const options = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	};
	return date.toLocaleDateString('en-US', options);
}

// Show error message
function showError(message) {
	const errorMessage = document.getElementById('error-message');
	errorMessage.textContent = message;
	errorMessage.style.display = 'block';
}

// Delete booking
async function deleteBooking(bookingId) {
	if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
		return;
	}

	try {
		const response = await fetch(`http://localhost:3000/api/bookings/${bookingId}`, {
			method: 'DELETE',
			credentials: 'include'
		});

		const data = await response.json();

		if (response.ok && data.success) {
			alert('Booking deleted successfully');
			loadBookings(); // Reload the bookings list
		} else {
			alert('Failed to delete booking: ' + (data.error || 'Unknown error'));
		}
	} catch (error) {
		console.error('Error deleting booking:', error);
		alert('Network error: Unable to delete booking. Make sure the server is running.');
	}
}

// Open edit modal
function openEditModal(booking) {
	const modal = document.getElementById('edit-modal');

	// Populate form fields
	document.getElementById('edit-booking-id').value = booking.id;
	document.getElementById('edit-first-name').value = booking.first_name;
	document.getElementById('edit-last-name').value = booking.last_name;
	document.getElementById('edit-phone').value = booking.phone;
	document.getElementById('edit-preferences').value = booking.preferences;

	// Set checkboxes
	document.getElementById('edit-service-foil').checked = booking.service_foil === 1;
	document.getElementById('edit-service-hair-cut').checked = booking.service_hair_cut === 1;
	document.getElementById('edit-service-balagge').checked = booking.service_balagge === 1;
	document.getElementById('edit-service-all-over-color').checked = booking.service_all_over_color === 1;
	document.getElementById('edit-service-wash-and-style').checked = booking.service_wash_and_style === 1;
	document.getElementById('edit-service-brow-wax').checked = booking.service_brow_wax === 1;

	// Update total cost
	updateEditTotalCost();

	// Show modal
	modal.style.display = 'block';

	// Add event listeners to checkboxes for live total update
	const checkboxes = [
		'edit-service-foil',
		'edit-service-hair-cut',
		'edit-service-balagge',
		'edit-service-all-over-color',
		'edit-service-wash-and-style',
		'edit-service-brow-wax'
	];

	checkboxes.forEach(id => {
		document.getElementById(id).addEventListener('change', updateEditTotalCost);
	});
}

// Close edit modal
function closeEditModal() {
	const modal = document.getElementById('edit-modal');
	modal.style.display = 'none';
}

// Update total cost in edit modal
function updateEditTotalCost() {
	const servicePrices = {
		'edit-service-foil': 155,
		'edit-service-hair-cut': 40,
		'edit-service-balagge': 195,
		'edit-service-all-over-color': 130,
		'edit-service-wash-and-style': 60,
		'edit-service-brow-wax': 50
	};

	let total = 0;
	for (const [id, price] of Object.entries(servicePrices)) {
		if (document.getElementById(id).checked) {
			total += price;
		}
	}

	document.getElementById('edit-total-cost').textContent = total;
}

// Save booking changes
async function saveBooking() {
	const bookingId = document.getElementById('edit-booking-id').value;

	// Collect form data
	const bookingData = {
		firstName: document.getElementById('edit-first-name').value,
		lastName: document.getElementById('edit-last-name').value,
		phone: document.getElementById('edit-phone').value,
		preferences: document.getElementById('edit-preferences').value,
		services: {
			foil: document.getElementById('edit-service-foil').checked,
			hair_cut: document.getElementById('edit-service-hair-cut').checked,
			balagge: document.getElementById('edit-service-balagge').checked,
			all_over_color: document.getElementById('edit-service-all-over-color').checked,
			wash_and_style: document.getElementById('edit-service-wash-and-style').checked,
			brow_wax: document.getElementById('edit-service-brow-wax').checked
		},
		totalCost: parseInt(document.getElementById('edit-total-cost').textContent)
	};

	// Validation
	if (!bookingData.firstName || !bookingData.lastName || !bookingData.phone || !bookingData.preferences) {
		alert('Please fill in all required fields');
		return;
	}

	try {
		const response = await fetch(`http://localhost:3000/api/bookings/${bookingId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify(bookingData)
		});

		const data = await response.json();

		if (response.ok && data.success) {
			alert('Booking updated successfully');
			closeEditModal();
			loadBookings(); // Reload the bookings list
		} else {
			alert('Failed to update booking: ' + (data.error || 'Unknown error'));
		}
	} catch (error) {
		console.error('Error updating booking:', error);
		alert('Network error: Unable to update booking. Make sure the server is running.');
	}
}

// Close modal when clicking outside of it
window.onclick = function(event) {
	const modal = document.getElementById('edit-modal');
	if (event.target === modal) {
		closeEditModal();
	}
}

// Auto-refresh bookings every 30 seconds
setInterval(loadBookings, 30000);
