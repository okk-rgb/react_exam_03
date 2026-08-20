import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_token_key_2026';

export const register = async (req, res, next) => {
  try {
    const { user_name, user_password, user_number, role, hash } = req.body;

    const existingUser = await User.findOne({ where: { user_name } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }

    const hashedPassword = await bcrypt.hash(user_password, 10);
    const newUser = await User.create({
      user_name,
      user_password: hashedPassword,
      user_number,
      role: role || 'user',
      hash: hash || null,
    });

    const token = jwt.sign(
      { id: newUser.id, user_name: newUser.user_name, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        user_name: newUser.user_name,
        user_number: newUser.user_number,
        role: newUser.role,
        hash: newUser.hash,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user_name, user_password } = req.body;

    const user = await User.findOne({ where: { user_name } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.id, user_name: user.user_name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Signed in successfully',
      token,
      user: {
        id: user.id,
        user_name: user.user_name,
        user_number: user.user_number,
        role: user.role,
        hash: user.hash,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['user_password'] },
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
