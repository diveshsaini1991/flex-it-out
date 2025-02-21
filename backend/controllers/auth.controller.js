const User = require("../models/user.model.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "user"
    });

    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 
    });

    res.status(201).json({ 
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'User does not exist!' });
    }

    if(user.role !== 'user') {
      return res.status(403).json({ error: 'Access denied. Not a user.' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials!' });
    }


    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 
    });

    res.json({ token, userId: user._id, role: user.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Admin does not exist!' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Not an admin.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials!' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('admintoken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 
    });

    res.json({ token, userId: user._id, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const userLogout = (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ error: "Unauthorized: Admins cannot log out using /logout" });
  }

  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'User logged out successfully' });
};

const adminLogout = (req, res) => {

  res.cookie('admintoken', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Admin logged out successfully' });
};



const checkAuthStatus = (req, res) => {
  try {
    const token = req.cookies.token|| req.cookies.admintoken; 
    if (!token) {
      return res.status(200).json({ authenticated: false });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err || !decoded) {
        return res.status(200).json({ authenticated: false });
      }
      return res.status(200).json({ authenticated: true, user: decoded.userId, role: decoded.role });
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ authenticated: false, error: 'Internal Server Error' });
  }
};

const createAdmin = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Only admins can create another admin." });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();

    res.status(201).json({
      message: "Admin account created successfully",
      userId: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  signup,
  login,
  userLogout,
  checkAuthStatus,
  adminLogin,
  createAdmin,
  adminLogout
};
