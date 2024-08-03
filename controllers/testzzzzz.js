const Order = require("../models/Order");
const Truck = require("../models/Truck");
const Logs = require("../models/Logs");
const moment = require("moment");

const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

exports.sendOrder = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ driverCheck: false });
  const truks = await Truck.find({ active: true });
  const logs = await Logs.find();
  let goodOrders = await [];
  let goodDrivers = await [];

  //   //   //   //   //   //   //   //   //   //   //   //
  //   FIND GOOD ORDER
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];

    const one = await logs.find((z) => {
      if (z.orderId.toString() === order._id.toString()) {
        return z;
      }
    });

    const result = await one.drivers.filter((d) => d.status === "waiting");
    if (!result.length) {
      try {
        await goodOrders.push(order);
      } catch (error) {}
    }
  }
  //   //   //   //   //   //   //   //   //   //   //   //

  //   //   //   //   //   //   //   //   //   //   //   //

  // ranande ha ro peyda konim
  // va tasmim begirim bedim be yeki

  //   //   //   //   //   //   //   //   //   //   //   //

  //   //   //   //   //   //   //   //   //   //   //   //
  //   FIND GOOD DRIVER
  for (let j = 0; j < goodOrders.length; j++) {
    const good = goodOrders[j];

    const avalabelDriver = await truks.find(async (d) => {
      d.companyAddress[0].city === good.origin.city &&
        d.truckType === good.truckType;
    });

    if (avalabelDriver) {
      goodDrivers.indexOf(avalabelDriver) === -1
        ? goodDrivers.push(avalabelDriver)
        : console.log("This item already exists");
    }
  }
  console.log("avalabelDriver", goodDrivers);

  //   //   //   //   //   //   //   //   //   //   //   //
  for (let k = 0; k < goodOrders.length; k++) {
    const goodOrd = goodOrders[k];

    for (let x = 0; x < goodDrivers.length; x++) {
      const goodDri = goodDrivers[x];

      if (goodOrd.origin.city === goodDri.companyAddress[0].city) {
        // const objDriver = {
        //   driverId: goodDri._id,
        //   status: "waiting",
        //   at: moment(),
        // };
        // const upLogs = await Logs.findOneAndUpdate(
        //   { orderId: goodOrd._id },
        //   {
        //     $push: { drivers: objDriver },
        //   }
        // );
        // console.log(
        //   "bede be ranandeye in ja in order ra>>>>>>>>>>>",
        //   objDriver
        // );
      }
    }
  }

  res.status(200).json({
    hi: goodOrders,
    goodDrivers,
    goodDriversLENGTH: goodDrivers.length,
    length: goodOrders.length,
  });
});

// exports.robat = async () => {
//   const alan = moment();
//   const checkLogs = await Logs.find();
//   for (let i = 0; i < checkLogs.length; i++) {
//     const element = checkLogs[i];
//     for (let j = 0; j < element.drivers.length; j++) {
//       const elem = element.drivers[j];

//       if (elem.status !== "waiting") {
//       } else {
//         const zamaneTahvilBeRanande = moment(elem.at);
//         const ago = alan.diff(zamaneTahvilBeRanande, "minutes");
//         console.log("ago", ago);
//         if (ago >= 3) {
//           console.log(
//             "injaaaaaaaaaa>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
//           );
//           await Logs.findOneAndUpdate(
//             { _id: element._id, "drivers.status": "waiting" },
//             {
//               $set: {
//                 "drivers.$.status": "reject",
//               },
//             }
//           );
//         }
//       }
//     }
//   }
// };
