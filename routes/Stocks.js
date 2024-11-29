const router = require("express").Router(),
  { browse } = require("../controllers/Stocks");

router
  .get("/", browse)

module.exports = router;
