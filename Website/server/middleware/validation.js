// Validation middleware for booking requests
function validateBooking(req, res, next) {
  const { firstName, lastName, phone, preferences, services, totalCost } = req.body;
  const errors = [];

  // Validate required fields
  if (!firstName || firstName.trim() === '') {
    errors.push('First name is required');
  }

  if (!lastName || lastName.trim() === '') {
    errors.push('Last name is required');
  }

  if (!phone || phone.trim() === '') {
    errors.push('Phone number is required');
  }

  if (!preferences || preferences.trim() === '') {
    errors.push('Preferences field is required');
  }

  // Validate services object
  if (!services || typeof services !== 'object') {
    errors.push('Services must be an object');
  } else {
    const validServices = ['foil', 'hair_cut', 'balagge', 'all_over_color', 'wash_and_style', 'brow_wax'];
    for (const service of validServices) {
      if (typeof services[service] !== 'boolean') {
        errors.push(`Service ${service} must be a boolean`);
      }
    }
  }

  // Validate total cost
  if (typeof totalCost !== 'number' || totalCost < 0) {
    errors.push('Total cost must be a positive number');
  }

  // If validation errors exist, return 400
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
}

module.exports = { validateBooking };
