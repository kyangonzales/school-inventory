const Rooms = require("../models/Rooms");
const mongoose = require('mongoose');
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
    const rooms = await Rooms.find({ deletedAt: { $exists: false } })
    .lean()

    const roomsWithItems = [...rooms]

    .map((room) => {
      const _items = items.filter((item) => { 
        return item?.room?._id.equals(mongoose.Types.ObjectId(room?._id));
      });

      return { ...room, items: _items };
    });
    
    const sortedRooms = [...roomsWithItems].sort((a, b) => {
      const lengthA = a?.items?.length || 0;
      const lengthB = b?.items?.length || 0;
      // console.log(`Comparing: A (${a._id}) [${lengthA}] vs B (${b._id}) [${lengthB}]`);
      return lengthB - lengthA;
    });
    
    
  

    
    res.json({
      payload: sortedRooms,
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
