const nodemailer = require("nodemailer");


exports.generateRandomString = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


exports.transformMsTimestampToTime = (msTimestamp) => {

    var currentDate = new Date(msTimestamp);
    // Hours part from the timestamp
    var hours = currentDate.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + currentDate.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + currentDate.getSeconds();

    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return formattedTime;
}


const mailer = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
        user: 'securedatemailerbeforedemo@gmail.com',
        pass: 'olonpcvrxawbepav',
    },
    secure: true,
});



exports.mailTransporter = mailer;