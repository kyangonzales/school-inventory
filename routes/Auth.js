const router = require("express").Router(),
  { login } =require("../controllers/Auth")

router.post("/login", login);

module.exports = router;