const express = require("express");

const C = require("../controllers/interservice");

const router = express.Router();

// POST
router.post("/createtruck", C.createTruck);

router.get("/adduserfavorite/:userId/:orderId",C.addUserToFavorite)
router.get("/removeuserfavorite/:userId/:orderId",C.removeUserToFavorite)
router.get("/findorder/:id",C.findOrder)

router.get("/getinfochart",C.getInfoForChart)


router.get('/getAllOrders' , C.AllOrders)

router.put('/cancelOrder/:id' , C.cancelOrder)

router.put('/raisePrice' , C.raisePrice)

router.get('/getTruck/:id' , C.getTrucks)

router.put('/acceptDriver' , C.acceptDriver)

// router.get("/dellall", C.delAll);

module.exports = router;
