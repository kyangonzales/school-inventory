const router = require("express").Router(),
  { save } = require("../controllers/Users");

router.post("/save", save);
module.exports = router;