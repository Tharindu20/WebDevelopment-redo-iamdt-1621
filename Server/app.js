const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require("cors");
const monk = require("monk");
const timeAgo = require("node-time-ago");
const mongo = require("mongo");
const mongodb = require("mongodb");
const momenttz = require('moment-timezone');
const moment = require('moment');
const nodemailer = require('nodemailer');
const os = require("os");

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Handling CORS
app.use(cors());

// Datbase and table details
const dbName = monk("mongodb+srv://Webserver:Webserver1234@cluster0.hsa8j.mongodb.net/amdt_db?retryWrites=true&w=majority"); 

const tblTestimonials = dbName.get("testimonials");

// App listner
app.listen(3000, function () {
  console.log("Application is running on Port 3000");
});

app.get("/", function (req, res) {
  res.send("API root is working.");
});

app.get('/test',(req, res, next) => {
    res.status(200).json({'returnval': '1', 'msg': "Test method is working."});
});

// To list the available testimonials
app.get("/listtestimonials", async function (req, res, next) {
  var resultTestimonials = await tblTestimonials.find();
  resultTestimonials.every(f => (f.time = timeAgo(f.time)));
  res.status(200).json({'returnval': '1', 'testimonials': resultTestimonials});
});

// To add new testimonials
app.post('/addtestimonials', async function (req, res, next) {    
    var name = req.body.name;
    var age = req.body.age;
    var testimonial = req.body.testimonial;
    var other_info = req.body.other_info;
    var created_on = moment().utc().format('YYYY-MM-DD HH:mm:ss.ms');

    // Check whether all the required parameters are having values
    if (name != undefined && name != "" && age != undefined && age != "" && testimonial != undefined && testimonial != "" ) {

        var objTestimonial = { name: name, age: age, testimonial: testimonial,other_info:other_info, created_on: created_on };  

        // Inserting the new record
        await tblTestimonials.insert(objTestimonial);

        res.status(200).json({'returnval': '1', 'msg': 'Inserted successfully.'});
    } else {
        res.status(200).json({'returnval': '0', 'msg': 'Required parameters cannot be empty.'});
    }
});

// To send email from the contact form
app.post('/sendemails', async function (req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var address = req.body.address;
  var message = req.body.message;
  
  if (name != undefined && name != "" && email != undefined && email != "" && message != undefined && message != "" ) {
    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'webserver733@gmail.com',
        pass: 'Webserver1234'
      }
    });

    var mailOptions = {
      from: email,
      to: 'webserver733@gmail.com',
      subject: 'AMDT Contact Form',
      text: 'Name:' + name 
        + os.EOL + 'Email: ' + email
        + os.EOL + 'Address: ' + address
        + os.EOL + 'Message: ' + message
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.status(200).json({'returnval': '0', 'msg': 'Email sending failed.'});
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({'returnval': '1', 'msg': 'Email sent successfully.'});
      }
    });
  } else {
      res.status(200).json({'returnval': '0', 'msg': 'Required parameters cannot be empty.'});
  }
});