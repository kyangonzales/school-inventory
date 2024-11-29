const Items = require("../models/Items");

const filter = (collections) =>  collections.filter((item) => !item.deletedAt)

const arrangeItems=async ()=>{
	try {
		const items = await Items.find().populate('room').populate('brand').lean();
		const arrangeItems = filter(items).reduce((acc, curr) =>{
			const {name, brand, status, condition='', quantity,barcode=""}=curr
			const key=`${name.toLowerCase()}-${brand._id}`
			const statusKey = `${status}${condition}`
			const index = acc.findIndex(({key:_key})=>key===_key)
	
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
				acc.push({...curr, key, Good:0, Missing:0, Damage:0,  findGood:0, findDamage:0, [statusKey]:quantity, [condition]:quantity})
	
			}
			return acc
	
		}, [])
	  return arrangeItems

	  } catch (error) {
	    console.log('Error in arrangeItems:',error.message)
	  }
}


module.exports = arrangeItems;


