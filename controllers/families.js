const familyService = require('../lib/services/familyService');

exports.createFamily = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await familyService.createFamily(req.user.id, name);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create family' });
  }
};

exports.getFamilyMembers = async (req, res) => {
  try {
    const result = await familyService.getFamilyMembers(req.user.id);
    if (result.error) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch family members' });
  }
};

exports.removeFamilyMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await familyService.removeFamilyMember(req.user.id, userId);
    if (result.error) {
      if (result.error === 'User not found in your family') {
        return res.status(404).json(result);
      }
      return res.status(403).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove family member' });
  }
};

exports.inviteUserToFamily = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await familyService.inviteUserToFamily(req.user.id, email);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to invite user to family' });
  }
};
