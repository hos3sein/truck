const Order = require("../models/Order");
const Truck = require("../models/Truck");
const Logs = require("../models/Logs");
const { refresh } = require("../utils/refresh");
const moment = require("moment");

const check = async () => {
  const alan = moment();
  const checkLogs = await Logs.find();
  for (let i = 0; i < checkLogs.length; i++) {
    const element = checkLogs[i];
    for (let j = 0; j < element.drivers.length; j++) {
      const elem = element.drivers[j];

      if (elem.status !== "waiting") {
      } else {
        const zamaneTahvilBeRanande = moment(elem.at);
        const ago = alan.diff(zamaneTahvilBeRanande, "minutes");
        if (ago >= 2) {
          const truck = await Truck.findOne({ _id: elem.driverId });
          // console.log("truck", truck);
          await refresh(truck.user._id, "refreshTruck");
          // console.log("truck.user._id", truck.user._id);

          await Logs.findOneAndUpdate(
            { _id: element._id, "drivers.status": "waiting" },
            {
              $set: {
                "drivers.$.status": "reject",
              },
            }
          );
        }
      }
    }
  }
};

// exports.robat = (interval) => {
//   setInterval(async () => {
//     await check();
//   }, interval);
// };
