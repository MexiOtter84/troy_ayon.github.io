# Kraken's Hair Salon - Booking System

This is a hair salon booking system with a Node.js/Express backend and SQLite database.

## Features

- Online booking form for salon services
- SQLite database for storing bookings
- RESTful API for managing bookings
- Static file serving for HTML/CSS/JS frontend

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Install dependencies:
```bash
npm install
```

2. The database will be automatically created on first run.

## Running the Server

### Development mode (with auto-restart):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Create Booking
- **POST** `/api/bookings`
- **Body**: JSON with booking details
- **Response**: Booking ID and success message

### Get All Bookings
- **GET** `/api/bookings`
- **Response**: Array of all bookings

### Get Booking by ID
- **GET** `/api/bookings/:id`
- **Response**: Single booking object

### Health Check
- **GET** `/api/health`
- **Response**: Server status

## Project Structure

```
/
├── server/                 # Backend code
│   ├── server.js          # Express server
│   ├── database.js        # SQLite database logic
│   ├── routes/            # API routes
│   └── middleware/        # Express middleware
├── database/              # SQLite database files
├── index.html             # Frontend HTML
├── hairshop.js            # Frontend JavaScript
├── style.css              # Frontend CSS
└── images/                # Static images
```

## Database Schema

The `bookings` table stores:
- Customer information (name, phone, preferences)
- Selected services (6 different services as booleans)
- Total cost
- Timestamp

## Available Services

1. Foiling - $155
2. Hair Cut - $40
3. Balayage - $195
4. All Over Color - $130
5. Wash & Style - $60
6. Brow Wax - $50

## Configuration

- Port: Default 3000 (can be changed via PORT environment variable)
- Database: SQLite stored in `database/bookings.db`

## Testing the System

1. Start the server: `npm start`
2. Open your browser to `http://localhost:3000`
3. Fill out the booking form with all required fields
4. Select at least one service
5. Click Submit
6. Verify booking confirmation message with booking ID appears
7. To view all bookings, visit: `http://localhost:3000/api/bookings`

## Viewing Stored Bookings

### Via API:
```bash
curl http://localhost:3000/api/bookings
```

### Via SQLite CLI:
```bash
sqlite3 database/bookings.db
SELECT * FROM bookings;
.exit
```

## Troubleshooting

- If you get a "Cannot GET /api/bookings" error, ensure the server is running
- If the form doesn't submit, check the browser console for errors
- If you get CORS errors, ensure the server is running on port 3000
- Database file is created automatically in the `database/` folder

## Production Deployment

For production deployment, consider:
1. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server/server.js --name kraken-salon
   pm2 save
   ```
2. Set up a reverse proxy (Nginx or Apache)
3. Configure HTTPS
4. Regular database backups
5. Set NODE_ENV=production

## Security Notes

- Server-side validation is implemented
- SQL injection protection via parameterized queries
- CORS is enabled (configure for production)
- Consider adding rate limiting for production

## Future Enhancements

- Admin dashboard to view and manage bookings
- Email notifications for new bookings
- Customer confirmation emails
- Calendar integration
- Payment processing
- User authentication for admin features

## License

ISC
