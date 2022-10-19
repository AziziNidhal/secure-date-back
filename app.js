const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const nodemailer = require("nodemailer");


const subscribersRoutes = require("./routes/subscribers");
const alertRoutes = require("./routes/alert");

const app = express();

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


app.use((error, req, res, next) => {
  console.log('**********************************************')
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});


app.listen(8080);

mongoose
  .connect(
    "mongodb+srv://supercode2050:supercode2050@cluster0.bmteaan.mongodb.net/?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(9080);
  })
  .catch((err) => {
    const error = new Error("Cant Connect to the database x(");
    error.statusCode = 500;
    throw error;
  });
