const DatePlan = require("../models/date");
const Subscriber = require("../models/subscriber");


const { generateRandomString, transformMsTimestampToTime } = require("../utils");


exports.planDate = async (req, res, next) => {
    const mid = req.body.mid;
    const start = req.body.startDate;
    const interval = req.body.interval;

    const existantSubscriber = await Subscriber.findOne({ mid: mid });

    const startMs = Number(start)*1000;
    const intervalMs = Number(interval)*1000;

    const haveToAlert = startMs + intervalMs;

    console.log(transformMsTimestampToTime(Date.now()));
    if (existantSubscriber) {
        try {

            const date = new DatePlan({
                start: startMs,
                haveToAlert: haveToAlert,
                subscriber: existantSubscriber,
                saverHasBeenNotified:false
            });

            const savedDate = date.save();

            const msg = `without any action, your saver will be notified after ${interval} seconds`;
            res.status(200).json({ message: "OK",msg:msg });

        } catch (err) {
            console.log(err)
            res.status(400).json({ message: "ERR" });
        }

    } else {
        res.status(404).json({ message: "User does not exist" });
    }

}


