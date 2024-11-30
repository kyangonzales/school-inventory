const Items = require("../models/Items");

const filter = (collections) =>  collections.filter((item) => !item.deletedAt)

exports.browse = async (_, res) => {
  try {
    
	const items = await Items.find().populate('room').populate('brand').lean();
    const arrangeItems = filter(items).reduce((acc, curr) =>{
		const {name, brand, status, condition='', quantity,barcode=""}=curr

		
		const key = `${name.toLowerCase()}-${brand._id}-${barcode}`;
		const statusKey = `${status}${condition}`;
		const index = acc.findIndex(({ key: _key }) => key === _key);

		if(index > -1){
			const findItem=acc[index]
			acc[index] = {
				...findItem,
				[statusKey]: findItem[statusKey] + quantity,
				...(condition && {
				  Missing: findItem.Missing - quantity,
				  [condition]: findItem[condition] + quantity,
				}),
			  };
			  
		}else{
			acc.push({
				...curr, 
				key, 
				Good:0, 
				Missing:0, 
				Damage:0,  
				findGood:0, 
				findDamage:0, 
				[statusKey]:quantity, 
				[condition]:quantity
			})
		}
		return acc

	}, [])
	res.json({
      payload:	arrangeItems ,
      message: "Successfully fetch items",

    });
  } catch (error) {
	console.log(error.message)
    res.status(400).json({ error: error.message });
  }
};
