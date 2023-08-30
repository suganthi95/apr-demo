const { Router } = require('express');
const controller = require("../controllers/adminlogin.controller.js");

const router = Router();

router.post("/create/table", controller.createAdminTable);
router.post("/create/table1", controller.createRegistrantTable);
router.post("/create/table2", controller.createRunnerTable);
router.post("/create/table3", controller.createEventTable);
router.post("/create/table4", controller.createPaymentTable);
router.post("/create/table5", controller.createRegistrantClassTable);
router.post("/create/table6", controller.createRegistrantTypeTable);
router.post("/create/table7", controller.createRegistrantSourceTable);

router.get("/signin", controller.adminLogin);
router.get("/access/token", controller.generateToken);

module.exports = router;