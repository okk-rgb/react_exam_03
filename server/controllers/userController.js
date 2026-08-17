import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['user_password'] },
      order: [['id', 'ASC']],
    });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
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

export const createUser = async (req, res, next) => {
  try {
    const { user_name, user_password, user_number, role } = req.body;
    const existing = await User.findOne({ where: { user_name } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }

    const hashedPassword = await bcrypt.hash(user_password, 10);
    const newUser = await User.create({
      user_name,
      user_password: hashedPassword,
      user_number,
      role: role || 'user',
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser.id,
        user_name: newUser.user_name,
        user_number: newUser.user_number,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { user_name, user_password, user_number, role } = req.body;
    if (user_name && user_name !== user.user_name) {
      const existing = await User.findOne({ where: { user_name } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Username is already taken' });
      }
      user.user_name = user_name;
    }

    if (user_password) {
      user.user_password = await bcrypt.hash(user_password, 10);
    }
    if (user_number !== undefined) user.user_number = user_number;
    if (role) user.role = role;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user.id,
        user_name: user.user_name,
        user_number: user.user_number,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await user.destroy();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
