const router = require("express").Router(),
  { save, update, browse, destroy } = require("../controllers/Rooms");

router
  .get("/", browse)
  .post("/save", save)
  .put("/update", update)
  .put("/destroy", destroy);


module.exports = router;
