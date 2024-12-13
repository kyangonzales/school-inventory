const Users = require("../models/Users");

exports.login = (req, res) => {
  const { email, password } = req.body;

  Users.findOne({ email })
    .select("-createdAt -updatedAt -__v")
    .then(async (item) => {
      if (!item)
        return res.status(201).json({
          error: "User Not Found",
          message: "The provided Credentials does not exist.",
          isSuccess:false
        });

      if (!(await item.matchPassword(password)))
        return res.status(201).json({
          error: "Invalid Credentials",
          message: "The provided Credentials does not match.",
          isSuccess:false
        });

      const user = { ...item._doc };
      delete user.password;

      res.json({
        success: "Login Success",
        payload: user,
        isSuccess:true
      });
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};
