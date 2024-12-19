const { User, Group, Task } = require('../models');

exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, address, groupIds, taskIds } = req.body;

    if (!name || !email || !phone || !address) {
      return res.status(400).json({ error: 'Missing required fields: name, email, phone, or address.' });
    }

    const user = await User.create({ name, email, phone, address });

    if (groupIds && Array.isArray(groupIds)) {
      const groups = await Group.findAll({ where: { id: groupIds } });

      if (groups.length !== groupIds.length) {
        return res.status(400).json({ error: 'One or more groups do not exist.' });
      }

      await user.addGroups(groups);
    }

    if (taskIds && Array.isArray(taskIds)) {
      const tasks = await Task.findAll({ where: { id: taskIds } });

      if (tasks.length !== taskIds.length) {
        return res.status(400).json({ error: 'One or more tasks do not exist.' });
      }

      await user.addTasks(tasks); 
    }

    const userWithDetails = await User.findByPk(user.id, { 
      include: [Group, { model: Task, attributes: ['id', 'name', 'deadline'] }]
    });
    res.status(201).json(userWithDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while creating the user.' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, address, groupIds, taskIds } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await user.update({ name, email, phone, address });

    if (groupIds && Array.isArray(groupIds)) {
      const groups = await Group.findAll({ where: { id: groupIds } });

      if (groups.length !== groupIds.length) {
        return res.status(400).json({ error: 'One or more groups do not exist.' });
      }

      await user.setGroups(groups);  
    }

    if (taskIds && Array.isArray(taskIds)) {
      const tasks = await Task.findAll({ where: { id: taskIds } });

      if (tasks.length !== taskIds.length) {
        return res.status(400).json({ error: 'One or more tasks do not exist.' });
      }

      await user.setTasks(tasks);  
    }

    const updatedUser = await User.findByPk(user.id, { 
      include: [Group, { model: Task, attributes: ['id', 'name', 'deadline'] }]
    });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while updating the user.' });
  }
};

exports.addUserToGroups = async (req, res) => {
  try {
    const { groupIds } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const groups = await Group.findAll({ where: { id: groupIds } });

    if (groups.length !== groupIds.length) {
      return res.status(400).json({ error: 'One or more groups do not exist.' });
    }

    await user.addGroups(groups); 
    res.status(200).json({ message: 'User successfully added to groups.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while adding the user to groups.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await user.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while deleting the user.' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        Group,  
        {
          model: Task,  
          attributes: ['id', 'name', 'deadline']  
        }
      ]
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching the user.' });
  }
};

exports.listAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        Group,  
        {
          model: Task,  
          attributes: ['id', 'name', 'deadline']  
        }
      ]
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
};