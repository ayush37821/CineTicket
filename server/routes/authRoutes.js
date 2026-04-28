import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../mongodb/models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Create token
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET || 'test_secret', {
      expiresIn: '1h',
    });

    res.status(201).json({ result: newUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Create token
    const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET || 'test_secret', {
      expiresIn: '1h',
    });

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

router.post('/update', async (req, res) => {
  try {
    const { id, name } = req.body;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ result: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});

export default router;
