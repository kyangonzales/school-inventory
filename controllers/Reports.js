const Items=require("../models/Items")



exports.browse = async (req, res) => {
	try {
	  const status=req.query.type
	  const items = await Items.find({status}).populate('room').populate('brand');

	   res.json({payload:items,success:"Successfully fetch reports"})
	} catch (error) {
	  res.status(400).json({ error: error.message });
	}
  };