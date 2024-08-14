const express = require("express");

const C = require("../controllers/dev");
const { protect } = require("../middleware/auth");

const router = express.Router();

// POST
router.post("/createperm",C.createPerm);

router.get("/dellall", C.delAll);
router.get("/alltruck/:id", C.allTruck);
router.get("/up/:id", C.up);
router.post("/cancel/:id",protect,C.cancel)

router.get("/dell/:id", C.dell);

router.get("/test", C.test);

router.get("/removeactiveOrder/:id",protect, C.removeActiveOrder);

router.post("/create", C.create);

router.post("/plate",protect,C.addplate)

module.exports = router;
