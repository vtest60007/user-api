const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sequelize = require('../common/db');
const defineUser = require('../common/models/User');
const User = defineUser(sequelize);

const generateAccessToken = (username, userId, role) =>
  jwt.sign({ username, userId, role }, process.env.JWT_SECRET || 'fallbackSecret', { expiresIn: '24h' });

// Register new user
exports.register = async (req, res) => {
  try {
    console.log('Incoming body:', req.body); // 👀 Debug log

    const { username, email, password, firstName, lastName, age } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: encryptedPassword,
      firstName,
      lastName,
      age,
      role: 'USER'
    });

    const token = generateAccessToken(user.username, user.id, user.role);

    res.status(201).json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email },
      token
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login existing user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateAccessToken(user.username, user.id, user.role);

    res.json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
