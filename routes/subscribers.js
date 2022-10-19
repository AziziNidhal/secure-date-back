const express = require("express");

const userController = require("../controllers/subscribers");

const router = express.Router();


router.post("/subscribe", userController.subscribeUser);

router.get("/checkSubscription", userController.checkSubscription);


router.get("/validateEmail", userController.validateEmail);
router.get("/refuseValidateEmail", userController.refuseValidateEmail);


module.exports = router;
