const express = require('express');
const router = express.Router();
const { authenticate } = require('../lib/middleware/auth');
const { validateRequest } = require('../middleware/validation');
const familiesController = require('../controllers/families');

router.post('/',
  authenticate,
  validateRequest({ name: 'required|string|min:2' }),
  familiesController.createFamily
);

router.get('/members', authenticate, familiesController.getFamilyMembers);

router.delete('/members/:userId', authenticate, familiesController.removeFamilyMember);

router.post('/invite',
  authenticate,
  validateRequest({ email: 'required|email' }),
  familiesController.inviteUserToFamily
);

module.exports = router;
