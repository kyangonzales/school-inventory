const Items = require("../models/Items");
const Rooms = require("../models/Rooms");
const Brands = require("../models/Brands")

exports.save = async (req, res) => {
  try {
    var item=req.body
    const {room,brand,brand_value,room_value}=item
    if(!room_value){
      const newRoom=await Rooms.create({name:room})
      item={...item,room:newRoom._id}
    }else{
      item={...item,room:room_value}

    }

    if(!brand_value){
      const newBrand= await Brands.create({name:brand})
      item={...item,brand:newBrand._id}
    }else{
      item={...item,brand:brand_value}
    }
    const newItem = await Items.create(item);
    const populateItem = await Items.findById(newItem._id).populate("room").populate("brand")
    res.json({ payload: populateItem, message: "Successfully item brand" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const filter = (collections) =>  collections.filter((item) => !item.deletedAt)
exports.browse = async (_, res) => {
  try {
    const items = await Items.find().populate('room').populate('brand').sort({ createdAt: -1 });
    const rooms = await Rooms.find().sort({ createdAt: -1 });
    const brands = await Brands.find().sort({ createdAt: -1 });
    res.json({
      payload:{ items:filter(items), rooms:filter(rooms), brands:filter(brands)  },
      
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
