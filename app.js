require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var https = require('https');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

let location = "";
let ipAddress = "";
let timezone = "";
let isp = "";
let lat = 51.505;
let lon = -0.09;

app.get("/", function(req, res) {
  res.render("index.ejs", {
    api: process.env.API,
    location: location,
    ipAddress: ipAddress,
    timezone: timezone,
    isp: isp,
    lat: lat,
    lon: lon
  });
});
app.post("/", (req, res)=>{
  console.log(req.body.IPaddress);
  var ip = req.body.IPaddress;
  var api_key = process.env.APIGEO;
  var api_url = 'https://geo.ipify.org/api/v1?';

  var url = api_url + 'apiKey=' + api_key + '&ipAddress=' + ip;

  https.get(url, function(response) {
      var str = '';
      response.on('data', function(chunk) { str += chunk; });
      response.on('end', function() {
        let obj = JSON.parse(str);
        console.log(obj.location.lat);
        location = obj.location.city;
        ipAddress = obj.ip;
        timezone = obj.location.timezone;
        isp = obj.isp;
        lat = obj.location.lat;
        lon = obj.location.lng;
        res.redirect("/")
       });
  }).end();
})

app.listen(3000, function() {
  console.log("Server is running");
})
