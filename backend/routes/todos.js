const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Todo = require('../models/Todo');

// GET /api/todos - list user's todos
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error(err); res.status(500).send('Server error');
  }
});

// POST /api/todos - create
router.post('/', auth, async (req, res) => {
  try {
    const { title, notes } = req.body;
    if(!title) return res.status(400).json({ msg: 'Title required' });
    const todo = new Todo({ user: req.user.id, title, notes });
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error(err); res.status(500).send('Server error');
  }
});

// PUT /api/todos/:id - update
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, notes, completed } = req.body;
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ msg: 'Todo not found' });
    if (todo.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized' });

    todo.title = title ?? todo.title;
    todo.notes = notes ?? todo.notes;
    if (typeof completed === 'boolean') todo.completed = completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error(err); res.status(500).send('Server error');
  }
});

// DELETE /api/todos/:id
router.delete('/:id', async (req, res) => {
  try {
    const todoId = req.params.id;
    const deletedTodo = await Todo.findByIdAndDelete(todoId);

    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});;

module.exports = router;
