const express = require('express');
const router = express.Router();
const userGroupController = require('../controllers/userGroupController');

router.post('/usertogroup', userGroupController.assignUserToGroups);

module.exports = router;