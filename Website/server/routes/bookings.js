const express = require('express');
const router = express.Router();
const dbQueries = require('../database.js');
const { validateBooking } = require('../middleware/validation.js');

// POST /api/bookings - Create new booking
router.post('/', validateBooking, async (req, res) => {
  try {
    const result = await dbQueries.createBooking(req.body);

    res.status(201).json({
      success: true,
      bookingId: result.id,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking',
      message: error.message
    });
  }
});

// GET /api/bookings - Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await dbQueries.getAllBookings();

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
});

// GET /api/bookings/:id - Get specific booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await dbQueries.getBookingById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      booking: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking'
    });
  }
});

// PUT /api/bookings/:id - Update booking
router.put('/:id', validateBooking, async (req, res) => {
  try {
    const bookingId = req.params.id;

    // Check if booking exists
    const existingBooking = await dbQueries.getBookingById(bookingId);
    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Update the booking
    await dbQueries.updateBooking(bookingId, req.body);

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully'
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update booking',
      message: error.message
    });
  }
});

// DELETE /api/bookings/:id - Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;

    // Check if booking exists
    const existingBooking = await dbQueries.getBookingById(bookingId);
    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Delete the booking
    await dbQueries.deleteBooking(bookingId);

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete booking',
      message: error.message
    });
  }
});

module.exports = router;
