const Order = require("./models/Order");
const Truck = require("./models/Truck");
const Logs = require("./models/Logs");
const moment = require("moment");
const asyncHandler = require("./middleware/async");

const findGoodOrder = asyncHandler(async () => {
  const orders = await Order.find({ driverCheck: false });

  const logs = await Logs.find();
  let goodOrders = await [];

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

  return {
    goodOrders,
    logs,
  };
});

const findGoodDriver = asyncHandler(async (goodOrders) => {
  const truks = await Truck.find({ active: true });
  let goodDrivers = await [];

  for (let j = 0; j < goodOrders.length; j++) {
    const good = goodOrders[j];
    // console.log(good._id);

    const avalabelDriver = await truks.filter(async (d) => {
      if (
        d.companyAddress[0].city === good.origin.city &&
        d.truckType === good.truckType
      ) {
        goodDrivers.indexOf(d) === -1 ? goodDrivers.push(d) : console.log("");
      }
    });
  }

  return goodDrivers;
});

const broadcastOrder = asyncHandler(async (goodOrders, goodDrivers, logs) => {
  // for ro kol ORDER ha
  for (let k = 0; k < goodOrders.length; k++) {
    const goodOrd = goodOrders[k];

    // for ro  kol DRIVER ha
    for (let x = 0; x < goodDrivers.length; x++) {
      const goodDri = goodDrivers[x];

      //   for ro kol LOGS ha
      for (let i = 0; i < logs.length; i++) {
        const element = logs[i];

        element.drivers.find(async (elm) => {
          if (
            elm.driverId.toString() === goodDri._id.toString() &&
            element.orderId.toString() === goodOrd._id.toString()
          ) {
            // console.log("injaaaaa>");

            const indexOfObject = goodDrivers.findIndex((object) => {
              return object._id === elm.driverId.toString();
            });

            await goodDrivers.splice(indexOfObject, 1);
          }
        });

        if (goodOrd.origin.city === goodDri.companyAddress[0].city) {
          const objDriver = {
            driverId: goodDri._id,
            status: "waiting",
            at: moment(),
          };
          //   console.log(objDriver);

          // const upLogs = await Logs.findOneAndUpdate(
          //   { orderId: goodOrd._id },
          //   {
          //     $push: { drivers: objDriver },
          //   }
          // );
          // console.log(
          //   "bede be ranandeye in ja in order ra>>>>>>>>>>>",
          //   objDriver,

          //   goodOrd._id
          // );
        }
      }
    }
  }
});

exports.run = (interval) => {
  setInterval(async () => {
    const resultOrder = await findGoodOrder();
    // console.log("result>>>>>>>>", result);
    const resultDriver = await findGoodDriver(resultOrder.goodOrders);
    const resultPlay = broadcastOrder(
      resultOrder.goodOrders,
      resultDriver,
      resultOrder.logs
    );
  }, interval);
};
