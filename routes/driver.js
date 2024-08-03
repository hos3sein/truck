const express = require("express");

const C = require("../controllers/driver");

const { protect } = require("../middleware/auth");

const router = express.Router();

// ! ok
router.get("/historyorderme", protect, C.allOrder);

// ! ok
router.get("/changestatus/:id", protect, C.changeStatus);

// ! ok
// id == log id
router.get("/bidprice/:id/:price", protect, C.bidPrice);

router.get("/bidpricenew/:id/:price", protect, C.bidPriceNew);

router.post("/updateprofile/:id", protect, C.updateProfile);
// router.post("/changestatustest/:id",protect,C.testChangeStatus)


// ! ok
router.get("/order", protect, C.order);

router.get("/profileme", protect, C.profileMe);

router.get("/recommended", protect, C.orderForMe);

router.get("/rejectorder/:id", protect, C.rejectOrder);

router.get("/acceptorder/:id", protect, C.acceptOrder);

router.get("/getactiveordersme",protect,C.getActiveOrdersMe)

router.get("/cancelbid/:id",protect,C.cancelBid)

module.exports = router;
