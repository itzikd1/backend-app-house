const carLocationHistoryService = require('../lib/services/carLocationHistoryService');

exports.getAllCarLocationHistory = async (req, res) => {
  try {
    const history = await carLocationHistoryService.getAllCarLocationHistory(req.user.id);
    res.json({ data: history });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch car location history' });
  }
};

exports.getCarLocationHistoryById = async (req, res) => {
  try {
    const history = await carLocationHistoryService.getCarLocationHistoryById(req.user.id, req.params.id);
    if (!history) {
      return res.status(404).json({ error: 'Car location history not found' });
    }
    res.json({ data: history });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch car location history' });
  }
};

exports.createCarLocationHistory = async (req, res) => {
  try {
    const history = await carLocationHistoryService.createCarLocationHistory(req.user.id, req.body);
    res.status(201).json({ data: history });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create car location history' });
  }
};

exports.updateCarLocationHistory = async (req, res) => {
  try {
    const history = await carLocationHistoryService.updateCarLocationHistory(req.user.id, req.params.id, req.body);
    if (!history) {
      return res.status(404).json({ error: 'Car location history not found' });
    }
    res.json({ data: history });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update car location history' });
  }
};

exports.deleteCarLocationHistory = async (req, res) => {
  try {
    const result = await carLocationHistoryService.deleteCarLocationHistory(req.user.id, req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Car location history not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete car location history' });
  }
};

