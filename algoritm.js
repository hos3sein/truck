const Order = require("./models/Order");
const Truck = require("./models/Truck");
const Logs = require("./models/Logs");
const moment = require("moment");
const asyncHandler = require("./middleware/async");
const { notification } = require("./utils/request");
const { refresh } = require("./utils/refresh");

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
  };
});

// ranande waiting nadarim
const findGoodDriver = asyncHandler(async (resultOrder) => {
  const { goodOrders } = await resultOrder;
  const truks = await Truck.find({ active: true });
  let goodDrivers = await [];

  for (let j = 0; j < goodOrders.length; j++) {
    const good = goodOrders[j];

    const avalabelDriver = await truks.filter(async (d) => {
      if (
        d.companyAddress[0].city === good.origin.city &&
        d.truckType === good.truckType
      ) {
        goodDrivers.indexOf(d) === -1 ? goodDrivers.push(d) : console.log(">>");
      }
    });
  }

  return { goodDrivers, goodOrders };
});

// ranande hay ro darim ke shahreshon ba in ordera yekiye
const broadcastOrder = asyncHandler(async (resultDriver) => {
  // order haye goodOrders witing nadarand
  // goodDrivers ha shar vatypeshon ba goodOrders mikhone
  const logs = await Logs.find();
  const { goodOrders, goodDrivers } = await resultDriver;

  //   on driver hay ke ba ye orderi mikhone va on order ro mishe behesh pishnahad kard
  for (let i = 0; i < goodDrivers.length; i++) {
    const takDriver = goodDrivers[i];

    const allGoodOrdersForTakDriver = goodOrders.filter(
      (or) =>
        or.origin.city == takDriver.companyAddress[0].city &&
        or.truckType === takDriver.truckType
    );

    // mikham roye allGoodOrdersForTakDriver
    // loop bezanam va har tak orderi ke mitonam be ranandeye sabete bala ke takdriver bashe pishnahad bedam ro
    for (let j = 0; j < allGoodOrdersForTakDriver.length; j++) {
      const takOderikeMisheBedam = allGoodOrdersForTakDriver[j];

      const takLog = await logs.find(
        (lo) => lo.orderId.toString() == takOderikeMisheBedam._id.toString()
      );
      // agar tak log peyda shod mirim be bareci
      const manHastamYaNa = await takLog.drivers.find(
        (tld) => tld.driverId.toString() == takDriver._id.toString()
      );

      const inLogDriverToshStatuWaitingHastYaNa = await takLog.drivers.find(
        (tld) => tld.status == "waiting"
      );

      if (typeof manHastamYaNa == "undefined") {
        const objDriver = {
          driverId: takDriver._id,
          status: "waiting",
          at: moment(),
        };

        const findLog = await Logs.findOne({
          orderId: takOderikeMisheBedam._id,
        });

        await Logs.findOneAndUpdate(
          { orderId: takOderikeMisheBedam._id },
          {
            $addToSet: { drivers: objDriver },
          }
        );
        const sender = {
          _id: findLog.order.requster._id,
          username: findLog.order.requster.username,
          pictureProfile: findLog.order.requster.pictureProfile,
        };

        const recipient = {
          _id: takDriver.user._id,
          username: takDriver.user.username,
          pictureProfile: takDriver.user.pictureProfile,
        };
        await notification(
          "recommended",
          recipient,
          sender,
          findLog._id,
          "Logs",
          "recommended for you",
          "for you recomended order in this time"
        );

        await refresh(takDriver.user._id, "refreshTruck");
      }
      if (
        typeof manHastamYaNa != "undefined" &&
        manHastamYaNa.status !== "reject"
      ) {
        const objDriver = {
          driverId: takDriver._id,
          status: "waiting",
          at: moment(),
        };

        const findLog = await Logs.findOne({
          orderId: takOderikeMisheBedam._id,
        });

        await Logs.findOneAndUpdate(
          { orderId: takOderikeMisheBedam._id },
          {
            $addToSet: { drivers: objDriver },
          }
        );

        const sender = {
          _id: findLog.order.requster._id,
          username: findLog.order.requster.username,
          pictureProfile: findLog.order.requster.pictureProfile,
        };

        const recipient = {
          _id: takDriver.user._id,
          username: takDriver.user.username,
          pictureProfile: takDriver.user.pictureProfile,
        };
        await notification(
          "recommended",
          recipient,
          sender,
          findLog._id,
          "Logs",
          "recommended for you",
          "for you recomended order in this time"
        );

        await refresh(takDriver.user._id, "refreshTruck");
      }

      // ba log moghayese konam ke mishe ino dad ya na
    }

    // break;
  }
  //   break;
});

// exports.run = (interval) => {
//   setInterval(async () => {
//     const resultOrder = await findGoodOrder();

//     if (resultOrder) {
//       const resultDriver = await findGoodDriver(resultOrder);

//       if (resultDriver) {
//         const resultPlay = await broadcastOrder(resultDriver);
//         if (resultPlay) {
//           console.log(">>=");
//         }
//       }
//     }
//   }, interval);
// };
