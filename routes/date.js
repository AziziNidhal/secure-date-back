const express = require("express");

const dateController = require("../controllers/date");

const router = express.Router();


router.post("/planDate", dateController.planDate);

module.exports = router;
