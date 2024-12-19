const { User, Group } = require('../models');

exports.assignUserToGroups = async (req, res) => {
    try {
      const { userId, groupIds } = req.body;
      if (!userId || !groupIds || !Array.isArray(groupIds)) {
        return res.status(400).json({ message: 'userId and groupIds are required, and groupIds must be an array' });
      }
  
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const groups = await Group.findAll({
        where: {
          id: groupIds 
        }
      });
  
      if (groups.length !== groupIds.length) {
        return res.status(404).json({ message: 'One or more groups not found' });
      }
  
      await user.addGroups(groups); 
  
      return res.status(200).json({ message: 'User successfully assigned to groups' });
    } catch (error) {
      console.error('Error in assigning user to groups:', error); 
      res.status(500).json({ message: 'Internal server error' });
    }
  };  