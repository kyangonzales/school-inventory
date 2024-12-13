const router = require("express").Router(),
  { browse } = require("../controllers/Dashboard");

router.get("/", browse);

module.exports = router;