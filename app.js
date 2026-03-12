const express = require('express');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// ✅ Middleware to parse JSON bodies
app.use(express.json());

// ✅ Middleware to parse URL-encoded form data (optional, for HTML forms)
app.use(express.urlencoded({ extended: true }));

// Import your route modules
const authRoutes = require('./authorization/routes');
const userRoutes = require('./users/routes');

// Mount routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 3000;
// Change here: bind to 0.0.0.0 instead of default localhost
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
