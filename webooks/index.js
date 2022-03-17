const express = require("express");
const bodyParser = require("body-parser");
var nodemailer = require("nodemailer");

const app = express();
const PORT = 3100;

// this application will receive JSON data
app.use(bodyParser.json());

// start the server on port 3100
app.listen(PORT, () => console.log(`Running on port ${PORT}`));

// process a GET request to http://localhost:3100/hello
app.get("/hello", (request, response) => {
  console.log(request.body);

  response.send("hi!");
});

app.post("/webhook", (request, response) => {
  const activity = request.body.activity;
  const msg = `💰🚀 ${activity[0].fromAddress} paid you ${activity[0].value} ETH. <br />https://rinkeby.etherscan.io/tx/${activity[0].hash} 💰🚀`;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "paulintokyo82@gmail.com",
      pass: "Teclisis8#$%^&*()_YFTGHJK",
    },
  });

  var mailOptions = {
    from: "paulintokyo82@gmail.com",
    to: "paul.p.markus@gmail.com",
    subject: "Update from calend3. You recieved a transaction!",
    html: msg,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  response.send(msg);
});
