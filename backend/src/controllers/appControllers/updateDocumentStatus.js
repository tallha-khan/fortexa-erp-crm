const mongoose = require('mongoose');

const allowedByModel = {
  Invoice: ['draft', 'pending', 'sent', 'refunded', 'cancelled', 'on hold'],
  Quote: ['draft', 'pending', 'sent', 'accepted', 'declined', 'cancelled', 'on hold'],
};

const updateDocumentStatus = (modelName) => async (req, res) => {
  try {
    const allowed = allowedByModel[modelName] || [];
    const { status } = req.body;

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid status',
      });
    }

    const Model = mongoose.model(modelName);
    const result = await Model.findOneAndUpdate(
      { _id: req.params.id, removed: false },
      { status, updated: new Date() },
      { new: true }
    ).exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: `${modelName} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      result,
      message: `Status updated to ${status}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error.message,
    });
  }
};

module.exports = updateDocumentStatus;
