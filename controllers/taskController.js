const { Task, User } = require('../models');

exports.createTask = async (req, res) => {
  try {
    const { name, deadline, userId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newTask = await Task.create({ name, deadline, userId });
    return res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, deadline, userId } = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    task.name = name;
    task.deadline = deadline;
    task.userId = userId;

    await task.save();
    return res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();
    return res.status(204).json();
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: { id },
      include: { model: User, attributes: ['id', 'name', 'email'] } 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error('Error getting task:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: { model: User, attributes: ['id', 'name', 'email'] }
    });

    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error getting tasks:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserByIdWithTasks = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: { id },
      include: { model: Task, attributes: ['id', 'name', 'deadline'] } 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user with tasks:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};