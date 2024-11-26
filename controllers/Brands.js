const Brands = require("../models/Brands");

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
    const brands = await Brands.find().sort({ createdAt: -1 });
    res.json({
      payload: brands.filter(({ deletedAt = "" }) => !deletedAt),
      message: "Successfully fetch brands",
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
