const express = require("express");

const dateController = require("../controllers/date");

const router = express.Router();


router.post("/planDate", dateController.planDate);


router.post("/incrementPlannedDate", dateController.incrementPlannedDate);
router.post("/endPlannedDate", dateController.endPlannedDate);

module.exports = router;
