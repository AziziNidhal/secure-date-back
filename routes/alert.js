const express = require("express");

const alertController = require("../controllers/alert");

const router = express.Router();


router.post("/createAlert", alertController.createAlert);
router.post("/pushGeoloc", alertController.pushGeoloc);
router.post("/pushImage", alertController.pushImage);



router.get("/getGeoPosList", alertController.getGeoPosList);
router.get("/getImagesList", alertController.getImagesList);



module.exports = router;
