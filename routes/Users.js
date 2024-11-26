const router = require("express").Router(),
  { browse } = require("../controllers/Users");

router.get("/browse", browse);

module.exports = router;
