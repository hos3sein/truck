const express = require("express");

const C = require("../controllers/interservice");

const router = express.Router();

// POST
router.post("/createtruck", C.createTruck);

router.get("/adduserfavorite/:userId/:orderId",C.addUserToFavorite)
router.get("/removeuserfavorite/:userId/:orderId",C.removeUserToFavorite)
router.get("/findorder/:id",C.findOrder)

router.get("/getinfochart",C.getInfoForChart)

// router.get("/dellall", C.delAll);

module.exports = router;
