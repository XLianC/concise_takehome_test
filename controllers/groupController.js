const { Group, User } = require('../models');

exports.createGroup = async (req, res) => {
  try {
    const { name, description, userIds } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const group = await Group.create({ name, description });

    if (userIds && userIds.length > 0) {
      const users = await User.findAll({
        where: {
          id: userIds,  
        },
      });

      if (users.length === 0) {
        return res.status(400).json({ error: 'No valid users found' });
      }

      await group.setUsers(users);
    }

    res.status(201).json(group);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const { name, description, userIds } = req.body;

    const group = await Group.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    await group.update({ name, description });

    if (userIds && userIds.length > 0) {
      const users = await User.findAll({
        where: {
          id: userIds,
        },
      });

      if (users.length === 0) {
        return res.status(400).json({ error: 'No valid users found' });
      }

      await group.setUsers(users);
    }

    const updatedGroup = await Group.findByPk(group.id, { include: User });
    res.json(updatedGroup);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    await group.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id, { include: User });
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.listAllGroups = async (req, res) => {
  try {
    const groups = await Group.findAll({
      include: User,  
    });
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
