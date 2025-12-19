// This javascript file controls the prices of each service and ensures the customer is able to order their selected services

// Below are the declarations for the costs of each service type available at the salon
var foil_cost = 155;
var hair_cut_cost = 40;
var balagge_cost = 195;
var allovercolor_cost = 130;
var washstyle_cost = 60;
var browwax_cost = 50;

// The following function will execute and updates information related to costs each time a checkbox item is checked or unchecked
function updatePrice(form) {
	total = 0;

	// This function has to make calls to update the total price as multiple checkboxes or options can be selected
	// If statements are then utilized to achieve this as opposed to using else if statements

	if (form.foil.checked == true) {
		total = total + foil_cost;
	}
	if (form.hair_cut.checked == true) {
		total = total + hair_cut_cost;
	}
	if (form.balagge.checked == true) {
		total = total + balagge_cost;
	}
	if (form.all_over_color.checked == true) {
		total = total + allovercolor_cost;
	}
	if (form.wash_and_style.checked == true) {
		total = total + washstyle_cost;
	}
	if (form.brow_wax.checked == true) {
		total = total + browwax_cost;
	}

	// Following updates the order total within index.html page
	const div_total = document.getElementById("total");
	div_total.innerHTML = '$' + total;

}

// The following function will execute when the submit button is pressed on the web form
async function submitForm(form) {
	// The following checks if a user has completed filling out First Name, Last Name, Phone and Preferences sections
	// First portion of function will return values of each textbox used for the above
	const fname_required = document.getElementById("fname").value;
	const lname_required = document.getElementById("lname").value;
	const phone_required = document.getElementById("phone").value;
	const preferences_required = document.getElementById("preferences").value;

	// Checks information input into requried textboxes and a bg style is added to missed entries
	const fname_style = document.getElementById("fname");
	const lname_style = document.getElementById("lname");
	const phone_style = document.getElementById("phone");
	const preferences_style = document.getElementById("preferences");

	// Notification is now presented to the user for the missing information in any of the textboxes
	if (fname_required == "") {
		fname_style.style.backgroundColor = "#FFCCCC";
		return

	} else if (lname_required == "") {
		lname_style.style.backgroundColor = "#FFCCCC";
		return

	} else if (phone_required == "") {
		phone_style.style.backgroundColor = "#FFCCCC";
		return

	} else if (preferences_required == "") {
		preferences_style.backgroundColor = "#FFCCCC";
		return

	} else {
		// Reset background colors
		fname_style.style.backgroundColor = "white";
		lname_style.style.backgroundColor = "white";
		phone_style.style.backgroundColor = "white";
		preferences_style.style.backgroundColor = "white";

		// Prepare booking data
		const bookingData = {
			firstName: fname_required,
			lastName: lname_required,
			phone: phone_required,
			preferences: preferences_required,
			services: {
				foil: form.foil.checked,
				hair_cut: form.hair_cut.checked,
				balagge: form.balagge.checked,
				all_over_color: form.all_over_color.checked,
				wash_and_style: form.wash_and_style.checked,
				brow_wax: form.brow_wax.checked
			},
			totalCost: total
		};

		try {
			// Send booking to backend
			const response = await fetch('http://localhost:3000/api/bookings', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(bookingData)
			});

			const result = await response.json();

			if (response.ok && result.success) {
				// Disable form after successful submission
				var inputs = document.getElementsByTagName("input");
				for (var i = 0; i < inputs.length; i++) {
					inputs[i].disabled = true;
				}

				// Update information displayed on booking information for the user
				var br = document.createElement("br");
				const div_booking = document.getElementById('booking');
				const getfName = document.getElementById("fname").value;
				const message = document.createTextNode("Thank you for booking " + getfName + ". Your booking ID is #" + result.bookingId);
				const printTotal = document.createTextNode("Your total for this appointment is estimated to be $" + total);

				div_booking.appendChild(br);
				div_booking.appendChild(message);
				div_booking.appendChild(br);
				div_booking.appendChild(printTotal);
			} else {
				// Handle validation or server errors
				alert('Error submitting booking: ' + (result.error || 'Unknown error'));
			}
		} catch (error) {
			// Handle network errors
			console.error('Network error:', error);
			alert('Failed to submit booking. Please check if the server is running and try again.');
		}
	}
}

// Creation of a reset button that is necessary to clear all the checkboxes from the form
function resetForm(form) {
	// Following will set each checkbox to false which will make them unchecked from the users perspective
	form.foil.checked = false;
	form.hair_cut.checked = false;
	form.balagge.checked = false;
	form.all_over_color.checked = false;
	form.wash_and_style.checked = false;
	form.brow_wax.checked = false;

	// Total cost is reset to default value of 0
	total = 0;

	// Total of the ortder total form is updated as well
	const div_total = document.getElementById("total");
	div_total.innerHTML = '$' + total;
}

// Allows customer to select all of the options as a customer is able to request a total package
function selectAll(form) {
	form.foil.checked = true
	form.hair_cut.checked = true
	form.balagge.checked = true
	form.all_over_color.checked = true
	form.wash_and_style.checked = true
	form.brow_wax.checked = true
}














