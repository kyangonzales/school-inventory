const router = require("express").Router(),
  {  browse } = require("../controllers/Reports");

router
  .get("/", browse)
  

module.exports = router;
