// damaged good missing
const Items = require("../models/Items");
const Rooms = require("../models/Rooms")
const mongoose = require('mongoose');
const arrangeItems=require("../widgets/arrangeItems")

const allStatus = async () => {
  try {
    const items = await Items.find().lean();
    const itemsCondition = items.reduce((acc, curr) => {
      const { status = "Good", quantity = 0, condition = "" } = curr;
      if (status === "Find") {
        acc[condition] = (acc[condition] || 0) + quantity;
        acc["Missing"] = (acc["Missing"] || 0) - quantity;
      } else {
        acc[status] = (acc[status] || 0) + quantity;
      }
      return acc;
    }, {});

    const orderedKeys = ["Good", "Damage", "Missing"];
    const orderedItemsCondition = Object.fromEntries(
      orderedKeys.map(key => [key, itemsCondition[key] || 0])
    );

    return orderedItemsCondition;
  } catch (error) {
    console.log("all status error:", error.message);
  }
};
const handleRooms = async () => {
  try {
    const items = await arrangeItems();
    const rooms = await Rooms.find({ deletedAt: { $exists: false } }).lean();

    const roomsWithItems = [...rooms].map((room) => {
      const _items = items.filter((item) => {
        return item?.room?._id.equals(mongoose.Types.ObjectId(room?._id));
      });

      return { ...room, items: _items };
    });

    const roomsWithCountOfItems = roomsWithItems.map((room) => {
      const { items = [], ...rest } = room;
      const itemCondition = items.reduce(
        (acc, curr) => {
          const { Good = 0, Damage = 0, Missing = 0 } = curr;

          acc["Good"] = acc["Good"] + Good;
          acc["Missing"] = acc["Missing"] + Missing;
          acc["Damage"] = acc["Damage"] + Damage;

          return acc;
        },
        { Good: 0, Missing: 0, Damage: 0 }
      );

      return { ...rest, ...itemCondition };
    });

    return roomsWithCountOfItems;
  } catch (error) {
    console.log("Eroor in handle Rooms:", error.message);
  }
};

exports.browse = async (req, res) => {
  try {
	res.json({
		payload:{allStatus:await allStatus(), rooms: await handleRooms()}
	})
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};