const Order = require("../models/Order");
const Truck = require("../models/Truck");
const Logs = require("../models/Logs");
const { refresh, refreshTruck } = require("./refresh");
const { addRefresh } = require("../utils/request");

const moment = require("moment");

const check = async () => {
  const allLogs = await Logs.find();

  for (let i = 0; i < allLogs.length; i++) {
    const element = allLogs[i];

    // agar outo price bod va to status init ya raise 1 ya 2 bod miyad to
    // age yeki pishnahad dade ya driver dare tosh nemiyad
    if (
      element.autoPrice &&
      (element.status == 0 || element.status == 2 || element.status == 3) &&
      element.bid == 0
    ) {
      const closeTime = moment(`${element.createdAt}`)
        .add(`${element.closingDate}`, "hour")
        .format("YYYY/MM/DD HH:mm");

      const createTime = moment(`${element.createdAt}`).format(
        "YYYY/MM/DD HH:mm"
      );

      const currentDate = moment(closeTime);
      const returnDate = moment(createTime);

      const alan = moment();

      // diff beyn create shodan ta close time
      const diff = currentDate.diff(returnDate, "minutes");

      // console.log("diff", diff);

      // diff create time ta alan
      const now = alan.diff(returnDate, "minutes");

      // ! in 60 o 80 bayad az setting biyad
      // ! to che zamani etefagh biyofte
      const res = (diff * 60) / 100;
      const res2 = (diff * 80) / 100;

      // console.log(now >= res && now <= res2);
      // console.log(now);
      // console.log(res);
      // console.log(res2);

      const difPrice = (element.maxPrice - element.price) / 2;
      // ! va in 60 o 80 ham bayad az setting biyad
      // ! chnd darsad price ziyad beshe
      // const perPrice = (difPrice * 60) / 100;
      // const perPrice2 = (difPrice * 80) / 100;

      if (now >= res && now <= res2 && element.status == 0) {
        const time = {
          status: 2,
          action: 2,
          at: Date.now(),
        };

        await Logs.findByIdAndUpdate(
          element._id,
          {
            $addToSet: { statusTime: time },
            raisedPrice: element.raisedPrice + difPrice,
            status: 2,
          },
          { strict: false }
        );

        await Order.findByIdAndUpdate(
          element.orderId,
          {
            $addToSet: { statusTime: time },

            raisedPrice: element.raisedPrice + difPrice,
            status: 2,
          },
          { strict: false }
        );

        

        await refreshTruck();
      }

      if (now >= res2 && now <= diff && element.status == 2) {
        await Logs.findByIdAndUpdate(
          element._id,
          {
            raisedPrice: element.raisedPrice + difPrice,
            status: 3,
          },
          { strict: false }
        );

        await Order.findByIdAndUpdate(
          element.orderId,
          {
            raisedPrice: element.raisedPrice + difPrice,
            status: 3,
          },
          { strict: false }
        );
       

        

        await refreshTruck();
      }
    }
  }
};

exports.robatRaised = (interval) => {
  setInterval(async () => {
    await check();
  }, interval);
};
