const { validationResult } = require("express-validator");
const { config } = require("../config");
const Alert = require("../models/alert");
const Geopos = require("../models/geopos");
const ImageAlert = require("../models/imagealert");
const Subscriber = require("../models/subscriber");
const { generateRandomString } = require("../utils");


exports.createAlert = async (req, res, next) => {
    const mid = req.body.mid;
    const long = req.body.long;
    const lat = req.body.lat;

    const generatedTracabilityCode = generateRandomString(100);

    const now = Date.now();


    const existantSubsctiber = await Subscriber.findOne({ mid: mid });



    if (existantSubsctiber) {
        try {

            const alert = new Alert({
                tracabilityCode: generatedTracabilityCode,
                creationTime: now,
                subscriber: existantSubsctiber
            });

            const savedAlert = alert.save();

            const geoPos = new Geopos({
                long: long,
                lat: lat,
                timestamp: now,
                alert: alert
            });

            const savedGeoPos = await geoPos.save();
            res.status(200).json({ message: "OK", tracabilityCode: generatedTracabilityCode });

        } catch (err) {
            res.status(400).json({ message: "ERR" });
        }

    } else {
        res.status(404).json({ message: "User does not exist" });
    }
}



exports.pushGeoloc = async (req, res, next) => {
    const tracabilityCode = req.body.tracabilityCode;
    const long = req.body.long;
    const lat = req.body.lat;

    const now = Date.now();


    const existantAlert = await Alert.findOne({ tracabilityCode: tracabilityCode });

    if (existantAlert) {
        try {

            const geoPos = new Geopos({
                long: long,
                lat: lat,
                timestamp: now,
                alert: existantAlert
            });

            const savedGeoPos = await geoPos.save();
            res.status(200).json({ message: "OK" });

        } catch (err) {
            res.status(400).json({ message: "ERR" });
        }

    } else {
        res.status(404).json({ message: "Alert does not exist" });
    }
}

exports.getGeoPosList = async (req, res, next) => {

    const tracabilityCode = req.query.tracabilityCode;

    const existantAlert = await Alert.findOne({ tracabilityCode: tracabilityCode });

    if (existantAlert) {

        const geoPosList = await Geopos.find({ alert: existantAlert }).sort({ timestamp: 1 })

        console.log(geoPosList)

        res.status(200).json(geoPosList)
    } else {
        res.status(404).json({ message: "Alert does not exist" });

    }



}



exports.getImagesList = async (req, res, next) => {

    const tracabilityCode = req.query.tracabilityCode;

    const existantAlert = await Alert.findOne({ tracabilityCode: tracabilityCode });

    if (existantAlert) {

        const imageList = await ImageAlert.find({ alert: existantAlert }).sort({ timestamp: 1 })

        const newList = imageList.map(img => {
            return {
                timestamp:img.timestamp,
                imageUrl: config.serverDomain + '/' + img.imageUrl
            }
        })
        console.log(newList);

        res.status(200).json(newList)
    } else {
        res.status(404).json({ message: "Alert does not exist" });

    }




}



exports.getGeoPosList = async (req, res, next) => {

    const tracabilityCode = req.query.tracabilityCode;

    const existantAlert = await Alert.findOne({ tracabilityCode: tracabilityCode });

    if (existantAlert) {

        const geoPosList = await Geopos.find({ alert: existantAlert }).sort({ timestamp: 1 })

        console.log(geoPosList)

        res.status(200).json(geoPosList)
    } else {
        res.status(404).json({ message: "Alert does not exist" });

    }



}










exports.pushImage = async (req, res, next) => {
    const tracabilityCode = req.body.tracabilityCode;

    let imageUrl;
    if (!req.file) {
        imageUrl = "images/default-avatar.png";
    } else {

        imageUrl = req.file.path.replace(String.fromCharCode(92), "/");
        imageUrl = imageUrl.replace(String.fromCharCode(92), "/");
    }

    const now = Date.now();


    const existantAlert = await Alert.findOne({ tracabilityCode: tracabilityCode });

    if (existantAlert) {
        try {


            const imageAlert = new ImageAlert({
                imageUrl: imageUrl,
                timestamp: now,
                alert: existantAlert
            });

            const savedImageAlert = await imageAlert.save();
            res.status(200).json({ message: "OK" });

        } catch (err) {
            res.status(400).json({ message: "ERR" });
        }

    } else {
        res.status(404).json({ message: "Alert does not exist" });
    }
}
