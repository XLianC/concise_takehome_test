const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.post('/', groupController.createGroup);
router.put('/:id', groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);
router.get('/:id', groupController.getGroupById);
router.get('/', groupController.listAllGroups);

module.exports = router;