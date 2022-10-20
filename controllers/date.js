const DatePlan = require("../models/date");
const Subscriber = require("../models/subscriber");


const { generateRandomString, transformMsTimestampToTime } = require("../utils");



exports.incrementPlannedDate = async (req, res, next) => {

    const dateIdentifier = req.body.dateIdentifier;


    const existantPlanedDate = await DatePlan.findOne({ dateIdentifier: dateIdentifier });


    if (existantPlanedDate) {

        try {


            const oldHaveToAlert = existantPlanedDate.haveToAlert;

            const intervalMs = existantPlanedDate.intervalMs;

            const newHaveToAlert = oldHaveToAlert + intervalMs;


            const changed = await existantPlanedDate.updateOne({ haveToAlert: newHaveToAlert });


            res.status(200).json({ message: 'ok' })
        } catch (err) {
            res.status(500).json({ message: 'ko' })

        }


    } else {

        res.status(404).json({ message: "Date does not exist" });

    }

}


exports.planDate = async (req, res, next) => {
    const mid = req.body.mid;
    const start = req.body.startDate;
    const interval = req.body.interval;

    const existantSubscriber = await Subscriber.findOne({ mid: mid });

    const startMs = Number(start) * 1000;
    const intervalMs = Number(interval) * 1000;

    const haveToAlert = startMs + intervalMs;

    console.log(transformMsTimestampToTime(Date.now()));
    if (existantSubscriber) {
        try {

            const identifier = generateRandomString(100);
            const date = new DatePlan({
                start: startMs,
                haveToAlert: haveToAlert,
                subscriber: existantSubscriber,
                saverHasBeenNotified: false,
                dateIdentifier: identifier,
                intervalMs: intervalMs
            });

            const savedDate = date.save();

            console.log('-------', savedDate._id)

            const msg = `without any action, your saver will be notified after ${interval} seconds`;
            res.status(200).json({ message: "OK", msg: msg, dateIdentifier: identifier });

        } catch (err) {
            console.log(err)
            res.status(400).json({ message: "ERR" });
        }

    } else {
        res.status(404).json({ message: "User does not exist" });
    }

}


