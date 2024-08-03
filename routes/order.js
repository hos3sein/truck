const express = require("express");

const C = require("../controllers/order");
// const T = require("../controllers/testzzzzz");

const { protect } = require("../middleware/auth");

const router = express.Router();

// POST

// ! ok
router.post("/createordertruck", protect, C.orderTruck);

// ! ok
// TODO bayad check she ke tosh bashan
router.post("/msg/:id", protect, C.msg);


// !ok
router.get("/historyorderme", protect, C.allOrderMe);

// ! ok
router.get("/cancelorderme/:id", protect, C.cancelOrderMe);

// ! ok
router.get("/accept/:id", protect, C.acceptDriver);

// router.post("/approverequest/:id", protect, C.approveRequest);
// router.get("/sendorder", T.sendOrder);
router.get("/updateprice/:id/:price", protect, C.updateOrder);

router.get("/topending/:id", protect, C.toPennding);

router.get("/canceldriver/:id", protect, C.cancelDriver);

router.get("/getallorder",protect,C.getAllOredr)

//delete
router.delete("/deleteorder/:id",protect,C.deleteOrder)

module.exports = router;
