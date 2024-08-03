const Order = require("../models/Order");
const Truck = require("../models/Truck");
const Logs = require("../models/Logs");

const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

exports.sendOrder = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ driverCheck: false });
  const truks = await Truck.find({ active: true });
  const logs = await Logs.find();
  let goodOrders = await [];
  let goodDrivers = await [];

  //   //   //   //   //   //   //   //   //   //   //   //
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
  for (let j = 0; j < goodOrders.length; j++) {
    const good = goodOrders[j];

    const avalabelDriver = await truks.find(
      (d) =>
        d.companyAddress[0].city === good.origin.city &&
        d.truckType === good.truckType
    );

    if (avalabelDriver) {
      goodDrivers.indexOf(avalabelDriver) === -1
        ? goodDrivers.push(avalabelDriver)
        : console.log("This item already exists");
    }

    // console.log(avalabelDriver);
  }
  //   //   //   //   //   //   //   //   //   //   //   //

  for (let k = 0; k < goodOrders.length; k++) {
    const goo = goodOrders[k];

    for (let x = 0; x < goodDrivers.length; x++) {
      const god = goodDrivers[x];

      if (goo.origin.city === god.companyAddress[0].city) {
        console.log("bede be ranandeye in ja in order ra", goo, god);
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
