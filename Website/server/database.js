const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const DB_PATH = path.join(__dirname, '../database/bookings.db');

// Initialize database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Create tables if they don't exist
function initializeDatabase() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      preferences TEXT NOT NULL,
      service_foil BOOLEAN DEFAULT 0,
      service_hair_cut BOOLEAN DEFAULT 0,
      service_balagge BOOLEAN DEFAULT 0,
      service_all_over_color BOOLEAN DEFAULT 0,
      service_wash_and_style BOOLEAN DEFAULT 0,
      service_brow_wax BOOLEAN DEFAULT 0,
      total_cost INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createTableSQL, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Bookings table ready');
    }
  });
}

// Database query functions
const dbQueries = {
  // Insert new booking
  createBooking: (bookingData) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO bookings (
          first_name, last_name, phone, preferences,
          service_foil, service_hair_cut, service_balagge,
          service_all_over_color, service_wash_and_style, service_brow_wax,
          total_cost
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        bookingData.firstName,
        bookingData.lastName,
        bookingData.phone,
        bookingData.preferences,
        bookingData.services.foil ? 1 : 0,
        bookingData.services.hair_cut ? 1 : 0,
        bookingData.services.balagge ? 1 : 0,
        bookingData.services.all_over_color ? 1 : 0,
        bookingData.services.wash_and_style ? 1 : 0,
        bookingData.services.brow_wax ? 1 : 0,
        bookingData.totalCost
      ];

      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  },

  // Get all bookings
  getAllBookings: () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM bookings ORDER BY created_at DESC';

      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // Get booking by ID
  getBookingById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM bookings WHERE id = ?';

      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Update booking
  updateBooking: (id, bookingData) => {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE bookings SET
          first_name = ?,
          last_name = ?,
          phone = ?,
          preferences = ?,
          service_foil = ?,
          service_hair_cut = ?,
          service_balagge = ?,
          service_all_over_color = ?,
          service_wash_and_style = ?,
          service_brow_wax = ?,
          total_cost = ?
        WHERE id = ?
      `;

      const params = [
        bookingData.firstName,
        bookingData.lastName,
        bookingData.phone,
        bookingData.preferences,
        bookingData.services.foil ? 1 : 0,
        bookingData.services.hair_cut ? 1 : 0,
        bookingData.services.balagge ? 1 : 0,
        bookingData.services.all_over_color ? 1 : 0,
        bookingData.services.wash_and_style ? 1 : 0,
        bookingData.services.brow_wax ? 1 : 0,
        bookingData.totalCost,
        id
      ];

      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  },

  // Delete booking
  deleteBooking: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM bookings WHERE id = ?';

      db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }
};

module.exports = dbQueries;
