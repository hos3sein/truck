const moment = require("moment");
const data = {
  day: 20,
  month: 12,
  year: 2022,
};

const close = 20;

const createdAt = "2023-02-06T09:50:06.406Z";

const check = async () => {
  const close = moment(`${createdAt}`)
    .add(2, "hour")
    .format("YYYY/MM/DD HH:mm");

  const create = moment(`${createdAt}`).format("YYYY/MM/DD HH:mm");

  const alan = moment();

  const closeDate = moment(close);
  const createDate = moment(create);

  const diff = closeDate.diff(createDate, "minutes");

  const now = alan.diff(createDate, "minutes");

  console.log("now", now);

  console.log("diff", diff);

  const res = (diff * 60) / 100;
  const res2 = (diff * 80) / 100;

  console.log("res", res);

  if (now >= res && now <= res2) {
    console.log("first");
  }

  if (now >= res2 && now <= diff) {
    console.log("two");
  }
};

check();
