const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const nodemailer = require("nodemailer");
const schedule = require('node-schedule');
const ejs = require('ejs');


const subscribersRoutes = require("./routes/subscribers");
const alertRoutes = require("./routes/alert");

const dateRoutes = require("./routes/date");
const app = express();

const { mailTransporter } = require("./utils");

const DatePlan = require("./models/date");
// const { transformMsTimestampToTime } = require("./utils");

const subscriber = require("./models/subscriber");


const PORT = process.env.PORT || 9080;


app.set('view engine', 'ejs');

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now().toString()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const supportedTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (supportedTypes.indexOf(file.mimetype) > -1) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


const mailer = nodemailer.createTransport({
  port: 465,               // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: 'securedatemailerbeforedemo@gmail.com',
    pass: 'olonpcvrxawbepav',
  },
  secure: true,
});




const job = schedule.scheduleJob('*/5 * * * * *', async () => {

  const msCurrentTime = Date.now() - 10000; //retarder de 10 secondes pour la latence
  const datesToAlert = await DatePlan.find({ haveToAlert: { $lte: msCurrentTime }, saverHasBeenNotified: false });


  // console.log('CurrentTime:',msCurrentTime,'datesToAlert:',dateToAlert);
  // console.log('Now:', transformMsTimestampToTime(msCurrentTime));
  if (datesToAlert && datesToAlert.length) {

    for (let i = 0; i < datesToAlert.length; i++) {
      const dateToAlert = datesToAlert[i];
      // console.log('ToAlert:', transformMsTimestampToTime(dateToAlert[i].haveToAlert));
      const sub = await subscriber.findById(dateToAlert.subscriber._id);
      const userFullName = sub.fullname;
      const saverFullname = sub.saverFullname;
      const saverEmail = sub.saverEmail;
      console.log('Saver Fullname:', saverEmail);


      /* *************** SEND EMAIL TO THE SAVER***************/



      ejs.renderFile(__dirname + '/views/email/notifySaver.ejs', { userFullName, saverFullname, saverEmail }, (err, data) => {



        if (err) {
          console.log(__dirname + '/../views/email/notifySaver.ejs');

          console.log(err);
        } else {
          const mailData = {
            from: 'securedatemailerbeforedemo@gmail.com',  // sender address
            to: saverEmail,   // list of receivers
            subject: `Prenez des nouvelles de ${userFullName} `,
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



      /* *************** SEND EMAIL TO THE SAVER***************/




      await dateToAlert.updateOne({
        saverHasBeenNotified: true
      });



    }


  }
});



app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use("/images", express.static(path.join(__dirname, "/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/subscribers", subscribersRoutes);
app.use("/alert", alertRoutes);
app.use("/date", dateRoutes);


app.use((error, req, res, next) => {
  console.log('**********************************************')
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});


mongoose
  .connect(
    "mongodb+srv://supercode2050:supercode2050@cluster0.bmteaan.mongodb.net/?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(PORT);
  })
  .catch((err) => {
    const error = new Error("Cant Connect to the database x(");
    error.statusCode = 500;
    throw error;
  });
