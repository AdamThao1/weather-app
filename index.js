//Packages that will be used
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const { response } = require("express");



app.use(bodyParser.urlencoded({ extended: true })); // parse urlData in req body /extended:true = allow parse of nested objects
//Here created our route for URL to page.html
app.get("/", function (req, res) { 
  res.sendFile(__dirname + "/page.html");
});

app.post("/", function (req, res) { //a post request to the "/" route
    const cityName = req.body.cityName; //grabs the city name by requesting the body
    const stateCode = req.body.stateCode; //grabs the state name by requesting the body
    const apiKey = "005b23cb733d4085fa4a8d17b6fd7db3"; //apiKey
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},US&limit=&appid=${apiKey}`;
    https.get(url, function (response) {//getting the https url and response
      response.on("data", (data) => {//listen for the data
        const geoData = JSON.parse(data)[0]; //geoData that parses the JSON response
        console.log(geoData);
        const lat = geoData.lat; //grabbing the lattitude
        console.log(lat);
        const lon = geoData.lon; //grabbing the longitude
        const url2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
        https.get(url2, function (response) { //getting the url2
          response.on("data", (data) => { //grab the data
            const jsondata = JSON.parse(data);//parse the json data
            console.log(jsondata, "<--");
            const tempature = jsondata.main.temp;//show temperature
            const des = jsondata.weather[0].description;//show the description
            const icon = jsondata.weather[0].icon;//show the icon
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";//grab the image url
            console.log("Here is the Weather Currently");
  
            res.write(`  
            <h1> The tempature in ${cityName}, ${geoData.state} is ${tempature} degrees</h1>
            <p>The weather description is ${des}</p>
            <img src="${imageURL}">` //the html response built using the method. 
            );
          });
        });
      });
    });
  });

  app.listen(7000, function(){
    console.log("running the server on 7000 port")
  }); //run the server