const Order = require("../models/Order");
const Truck = require("../models/Truck");
const Logs = require("../models/Logs");
const { refresh, refreshTruck } = require("./refresh");
const { addRefresh, notification } = require("../utils/request");
const moment = require("moment");

const check = async () => {
  const allLogs = await Logs.find();

  for (let i = 0; i < allLogs.length; i++) {
    const element = allLogs[i];

    const closeTime = moment(`${element.createdAt}`)
      .add(`${element.closingDate}`, "hour")
      .format("YYYY/MM/DD HH:mm");

    const alan = moment();

    const currentDate = moment(closeTime);

    // ! in 0 she bayad driver accept she
    const now2 = currentDate.diff(alan, "minutes");
    
    if (
      !element.end &&
      (element.status == 0 || element.status == 2 || element.status == 3) &&
      !element.drivers.length &&
      now2 <= 0
    ) {
        console.log('come to the fucking loop for the status < 4')
      await Logs.findOneAndUpdate(
        {
          _id: element._id,
        },
        {
          end: true,
        }
      );

      await Order.findByIdAndUpdate(element.orderId, {
        end: true,
      });

      

      
      // await refresh(truck.user._id, "refreshTruck");
      
      await refreshTruck();
      console.log(`${element.productName} closed and refreshed for application`)
    }

    if (element.status == 1 && element.drivers.length && now2 <= 0) {
      const truck = await Truck.findById(element.drivers[0].driverId);
      // console.log("element.order", element.orderId, now2);

      const objDriver = {
        _id: truck.user._id,
        username: truck.user.username,
        phone: truck.user.phone,
        pictureProfile: truck.user.pictureProfile,
        companyName: truck.companyName,
        truckPlate: truck.truckPlate,
        truckType: truck.truckType,
        transportCapacity: truck.transportCapacity,
      };

      const time = {
        status: 4,
        action: 0,

        at: Date.now(),
      };

      await Logs.findOneAndUpdate(
        {
          _id: element._id,
          "drivers.driverId": truck._id,
        },
        {
          $set: {
            "drivers.$.status": "accept",
          },
          $addToSet: { statusTime: time },
          status: 4,
          raisedPrice: element.bid,
          driver: objDriver,
        }
      );

      await Order.findByIdAndUpdate(element.orderId, {
        $addToSet: { statusTime: time },

        driverCheck: true,

        driver: objDriver,
        status: 4,
        raisedPrice: element.bid,
      });
      await refreshTruck();
    }
  }
};

exports.acceptDriver = (interval) => {
  setInterval(async () => {
    await check();
  }, interval);
};

// ! bayad check konm agar closing time bade date mishod error bedam
// toye robat raise price va accept driver ham check konm moment ha va diff ha bar asas on adade close time base na day o month  year
