const Brands = require("../models/Brands");
const mongoose = require('mongoose');
const arrangeItems=require("../widgets/arrangeItems")

exports.save = async (req, res) => {
  try {
    const brand = await Brands.create(req.body);
    res.json({ payload: brand, message: "Successfully added brand" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.browse = async (req, res) => {
  try {
    const items= await arrangeItems()    
    const brands = await Brands.find({ deletedAt: { $exists: false } })
    .lean()

    const brandsWithItems = [...brands]

    .map((brand) => {
      const _items = items.filter((item) => { 
        return item?.brand?._id.equals(mongoose.Types.ObjectId(brand?._id));
      });

      return { ...brand, items: _items };
    });
    
    const sortedBrands = [...brandsWithItems].sort((a, b) => {
      const lengthA = a?.items?.length || 0;
      const lengthB = b?.items?.length || 0;
      return lengthB - lengthA;
    });
    
    
  

    
    res.json({
      payload: sortedBrands,
      message: "Successfully fetch brand",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};






exports.update = async (req, res) => {
  try {
    const brand = await Brands.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
    });
    res.json({ payload: brand, message: "Successfully update brand" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.destroy = async (req, res) => {
  try {
    const brand = await Brands.findByIdAndUpdate(
      req.body._id,
      { deletedAt: new Date() },
      {
        new: true,
      }
    );
    res.json({ payload: brand, message: "Successfully update brand" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
