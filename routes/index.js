const express = require("express");
const router = express.Router();

//prefix router Order
const order = require("./order");
router.use("/order", order);

//prefix router Driver
const driver = require("./driver");
router.use("/driver", driver);

//prefix router Dev
const dev = require("./dev");
router.use("/dev", dev);

//prefix router interservice

const interservice = require("./interservice");
router.use("/interservice", interservice);

module.exports = router;
