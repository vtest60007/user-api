const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./database'); // import Sequelize instance
const User = require('./models/User'); // import model

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./authorization/routes');
const userRoutes = require('./users/routes');
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 3000;

// ✅ Sync database before starting server
sequelize.sync({ alter: true }) // use { force: true } if you want to drop/recreate tables
  .then(() => {
    console.log("Database synced successfully");
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error syncing database:", err);
  });
