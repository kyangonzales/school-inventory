const Items=require("../models/Items")



exports.browse = async (req, res) => {
	try {
	   const status = req.query.type;
	   const filter = status && status !== 'All' ? { status } : {};
	   const items = await Items.find(filter).populate('room').populate('brand').populate('registrar').sort({createdAt:-1});
	   res.json({ payload: items, success: "Successfully fetched reports" });

	} catch (error) {
	  res.status(400).json({ error: error.message });
	}
  };