const Entity = require("../models/Users");

exports.save = async (req, res) => {
  try {
    const user = req.body;
    const isExist = await Entity.findOne({ email: user.email });
    if (isExist?._id) {
      res.status(201).json({
        success: "Successfully Registered",
        payload: { duplicateEmail: true },
      });
    } else {
      const newUser = await Entity.create(user);
      delete newUser.password;
      res.status(201).json({
        success: "Successfully Registered",
        payload: newUser,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};