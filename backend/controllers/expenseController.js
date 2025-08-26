// controllers/expenseController.js
const Expense = require('../models/Expense');

// READ: Get all expenses for logged-in user
const getExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, from, to } = req.query;
    const filter = { userId: req.user.id };
    if (category) filter.category = category;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const expenses = await Expense.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Expense.countDocuments(filter);

    res.json({ data: expenses, page: Number(page), total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE: Add a new expense
const addExpense = async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;
    if (amount == null || amount < 0) {
      return res.status(400).json({ message: 'Amount must be >= 0' });
    }
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const expense = await Expense.create({
      userId: req.user.id,
      amount,
      category,
      date: date ? new Date(date) : Date.now(),
      note
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE: Update one expense by id (only if owned by user)
const updateExpense = async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    if (String(expense.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (amount != null) expense.amount = amount;
    if (category) expense.category = category;
    if (date) expense.date = new Date(date);
    if (note != null) expense.note = note;

    const updated = await expense.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE: Delete one expense by id (only if owned by user)
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    if (String(expense.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await expense.deleteOne();
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getExpenses, addExpense, updateExpense, deleteExpense };