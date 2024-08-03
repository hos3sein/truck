const Group = require("../models/Group");
const schedule = require("node-schedule");
const fetch = require("node-fetch");

const check = async () => {
  const url = `${process.env.SERVICE_SETTING}/api/v1/setting/dev/allgroup`;

  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();
    if (response.success) {
      for (let i = 0; i < response.data.length; i++) {
        const element = response.data[i];
        const find = await Group.findOne({ name: element.name });

        if (find) {
          await find.updateOne({
            name: element.name,
            permissions: element.permissions,
            autoApprove: element.autoApprove,
          });
        }

        if (!find) {
          await Group.create(element);
        }
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};

exports.checkGroup = async (req, res, next) => {
  schedule.scheduleJob(`* 10 * * * *`, function () {
    check();
  });
};
