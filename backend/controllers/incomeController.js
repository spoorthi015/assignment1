// controllers/incomeController.js
const Income = require('../models/Income');

// READ: Get all income for logged-in user
const getIncome = async (req, res) => {
  try {
    const { page = 1, limit = 20, source, from, to } = req.query;
    const filter = { userId: req.user.id };
    if (source) filter.source = source;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const income = await Income.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Income.countDocuments(filter);

    res.json({ data: income, page: Number(page), total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE: Add a new income
const addIncome = async (req, res) => {
  try {
    const { amount, source, date, note } = req.body;
    if (amount == null || amount < 0) {
      return res.status(400).json({ message: 'Amount must be >= 0' });
    }
    if (!source) {
      return res.status(400).json({ message: 'Source is required' });
    }

    const inc = await Income.create({
      userId: req.user.id,
      amount,
      source,
      date: date ? new Date(date) : Date.now(),
      note
    });

    res.status(201).json(inc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE: Update one income by id
const updateIncome = async (req, res) => {
  try {
    const { amount, source, date, note } = req.body;
    const inc = await Income.findById(req.params.id);

    if (!inc) return res.status(404).json({ message: 'Income not found' });
    if (String(inc.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (amount != null) inc.amount = amount;
    if (source) inc.source = source;
    if (date) inc.date = new Date(date);
    if (note != null) inc.note = note;

    const updated = await inc.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE: Delete one income by id
const deleteIncome = async (req, res) => {
  try {
    const inc = await Income.findById(req.params.id);
    if (!inc) return res.status(404).json({ message: 'Income not found' });
    if (String(inc.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await inc.deleteOne();
    res.json({ message: 'Income deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getIncome, addIncome, updateIncome, deleteIncome };
