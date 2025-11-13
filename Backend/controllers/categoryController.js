import Category from "../models/category.js";

export const getCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    const categories = await Category.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch categories" });
  }
};

export const addCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, type, color } = req.body;

    const category = await Category.create({ userId, name, type, color });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to create category" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, color },
      { new: true }
    );

    res.status(200).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update category" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete category" });
  }
};
