import { Category, Card } from '../models/index.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      order: [['id', 'ASC']],
    });
    res.json({ success: true, count: categories.length, categories });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Card, as: 'cards' }],
    });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { category_name } = req.body;
    const existing = await Category.findOne({ where: { category_name } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category name already exists' });
    }

    const category = await Category.create({ category_name });
    res.status(201).json({ success: true, message: 'Category created successfully', category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const { category_name } = req.body;
    if (category_name && category_name !== category.category_name) {
      const existing = await Category.findOne({ where: { category_name } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Category name already exists' });
      }
      category.category_name = category_name;
    }

    await category.save();
    res.json({ success: true, message: 'Category updated successfully', category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    await category.destroy();
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
