const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Subscriber = require("../models/subscriber");
const { generateRandomString, mailTransporter } = require("../utils");
const { config } = require("../config");
const ejs = require('ejs');


const sendValidationMail = async (secretKey, userFullName, saverFullname, saverEmail) => {
    const link = `https://secure-date-back.herokuapp.com/subscribers/validateEmail?secretKey=${secretKey}`;
    const refuseLink = `https://secure-date-back.herokuapp.com/subscribers/refuseValidateEmail?secretKey=${secretKey}`;


    ejs.renderFile(__dirname + '/../views/email/validation.ejs', { secretKey, userFullName, saverFullname, saverEmail, link, refuseLink }, (err, data) => {



        if (err) {
            console.log(__dirname + '/../views/email/validation.ejs');

            console.log(err);
        } else {
            const mailData = {
                from: 'securedatemailerbeforedemo@gmail.com',  // sender address
                to: saverEmail,   // list of receivers
                subject: `${userFullName} a besoin de vous`,
                html: data
            };

            mailTransporter.sendMail(mailData, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
            });
        }
    });


}


exports.checkSubscription = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation Failed, entered data is incorrect");
        error.statusCode = 422;
        error.data = errors.array();
        next(error);
        return;
    }

    const mid = req.query.mid;


    const existantSubsctiber = await Subscriber.findOne({ mid: mid });

    if (existantSubsctiber) {
        res.status(200).json(existantSubsctiber)
    } else {
        res.status(404).json(null)
    }

}


exports.subscribeUser = async (req, res, next) => {

    let mailValidationSecretKey = generateRandomString(100);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation Failed, entered data is incorrect");
        error.statusCode = 422;
        error.data = errors.array();
        next(error);
        return;
    }

    const mid = req.body.mid;
    const fullname = req.body.fullname;
    const emergencyText = req.body.emergencyText;

    const saverFullname = req.body.saverFullname;

    const saverEmail = req.body.saverEmail;

    const password = req.body.password;

    const existantSubsctiber = await Subscriber.findOne({ mid: mid });

    if (!existantSubsctiber) {
        try {
            const hashedPw = await bcrypt.hash(password, 12);
            const subscriber = new Subscriber({
                mid: mid,
                fullname: fullname,
                emergencyText: emergencyText,
                saverFullname: saverFullname,
                saverEmail: saverEmail,
                password: hashedPw,
                validationKey: mailValidationSecretKey
            });

            const result = await subscriber.save();

            if (result) {


                const sentMail = await sendValidationMail(mailValidationSecretKey, fullname, saverFullname, saverEmail);
                console.log('SENTMAIL', sentMail)

                res.status(201).json({ message: "Suscription created successfully!, your saver has been has been notified ", userId: result.mid });



            }

        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }

    } else {

        try {
            let newMailValidationSecretKey = generateRandomString(100);


            await existantSubsctiber.update({
                fullname: fullname,
                emergencyText: emergencyText,
                saverFullname: saverFullname,
                saverEmail: saverEmail,
                saverEmailValidated: false,
                validationKey: newMailValidationSecretKey
            });

            const sentMail = await sendValidationMail(newMailValidationSecretKey, fullname, saverFullname, saverEmail);


            res.status(200).json({ message: "Subscriber data updated, your saver will be notified" });






        } catch (err) {
            res.status(400).json({ message: "Error" });

        }

    }

};


exports.validateEmail = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation Failed, entered data is incorrect");
        error.statusCode = 422;
        error.data = errors.array();
        next(error);
        return;
    }

    try {

        const secretKey = req.query.secretKey;
        console.log(`secretKey: ${secretKey}`);

        const existantSubsctiber = await Subscriber.findOne({ validationKey: secretKey });

        if (existantSubsctiber) {
            await existantSubsctiber.update({
                saverEmailValidated: true,
                validationKey: ""
            });

            res.render('pages/email-valide', {
                userFullName: existantSubsctiber.fullname,
                saverFullName: existantSubsctiber.saverFullname
            });
        } else {
            res.render('pages/email-error', {
                saverFullName: "User"
            });
        }

    } catch (err) {
        res.status(400).json({ message: "Error" });
    }
};

exports.refuseValidateEmail = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation Failed, entered data is incorrect");
        error.statusCode = 422;
        error.data = errors.array();
        next(error);
        return;
    }

    try {

        const secretKey = req.query.secretKey;

        const existantSubsctiber = await Subscriber.findOne({ validationKey: secretKey });

        if (existantSubsctiber) {
            await existantSubsctiber.update({
                saverEmailValidated: false,
                validationKey: ""
            });

            res.render('pages/email-decline', {
                userFullName: existantSubsctiber.fullname,
                saverFullName: existantSubsctiber.saverFullname
            });
        } else {
            res.render('pages/email-error', {
                saverFullName: "User"
            });
        }

    } catch (err) {
        res.status(400).json({ message: "Error" });

    }

};

