const Items = require("../models/Items");
const Rooms = require("../models/Rooms");
exports.save = async (req, res) => {
  try {
    const item = await Items.create(req.body);
    const populateItem = await Items.findById(item._id).populate('room')
    res.json({ payload: populateItem, message: "Successfully item brand" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const filter = (collections) =>  collections.filter((item) => !item.deletedAt)
exports.browse = async (_, res) => {
  try {
    const items = await Items.find().populate('room').sort({ createdAt: -1 });
    const rooms = await Rooms.find().sort({ createdAt: -1 });
    res.json({
      payload:{ items:filter(items), rooms:filter(rooms) },

      message: "Successfully fetch items",
      
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await Items.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    });
    res.json({ payload: item, message: "Successfully update item" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.destroy = async (req, res) => {
  try {
    const item = await Items.findByIdAndUpdate(
      req.body._id,
      { deletedAt: new Date() },
      {
        new: true,
      }
    );
    res.json({ payload: item, message: "Successfully deleted item" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
