const Rooms = require("../models/Rooms");
const Items = require ("../models/Items")
const arrangeItems=require("../widgets/arrangeItems")
exports.save = async (req, res) => {
  try {
    const room = await Rooms.create(req.body);
    res.json({ payload: room, message: "Successfully room brand" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.browse = async (req, res) => {
  try {
    const items= await arrangeItems()
    console.log("items:",items)
    
    const rooms = await Rooms.find({ deletedAt: { $exists: false } })
    .lean()
      .sort({ createdAt: -1 });

    const roomsWithItems = [...rooms]
    .map((room) => {
      const _items = items.filter(({room:r}) =>r._id === room._id );
      return { ...room, items: _items };
    });
  

    
    res.json({
      payload: roomsWithItems,
      message: "Successfully fetch rooms",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const room = await Rooms.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    });
    res.json({ payload: room, message: "Successfully update room" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.destroy = async (req, res) => {
  try {
    const room = await Rooms.findByIdAndUpdate(
      req.body._id,
      { deletedAt: new Date() },
      {
        new: true,
      }
    );
    res.json({ payload: room, message: "Successfully deleted room" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
