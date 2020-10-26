// statics
let express = require('express');
let cors = require('cors');
let superagent = require('superagent');

let app = express();
app.use(cors());

require('dotenv').config();

const PORT = process.env.PORT;
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const TRAIL_API_KEY = process.env.TRAIL_API_KEY;


//

// first request
app.get('/location', handelLocation);


function handelLocation(req, res) {

  let city = req.query.city;
  // let jsonData = require('./data/location.json');
  superagent.get(`https://eu1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${city}&format=json`)
    .then((data) => {
      let jsonObject = data.body[0];
      let locationObject = new Location(city, jsonObject.display_name, jsonObject.lat, jsonObject.lon);
      res.status(200).json(locationObject);
    })
  // let jsonObject = jsonData[0];
  // let locationObject = new Location(city, jsonObject.display_name, jsonObject.lat, jsonObject.lon);
  // res.status(200).json(locationObject);
    .catch(() => {
      res.send('Sorry, something went wrong');
    });

}

function Location(search_query, formatted_query, latitude, longitude) {
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.latitude = latitude;
  this.longitude = longitude;

}


//

// second request
app.get('/weather', handelWeather);


function Weather(forecast, time) {
  this.forecast = forecast;
  this.time = time;
}

function handelWeather(req, res) {

//   let city = req.query.search_query;

  superagent.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${req.query.search_query}&key=${WEATHER_API_KEY}`)
    .then((value) => {
      let jsonObject = value.body.data;

      let result =jsonObject.map((element)=>{
          return new Weather(element.weather.description,taskDate(Date.parse(element.datetime)))
      })

      res.status(200).json(result);

    }).catch(() => {
      res.send('Sorry, something went wrong');
    });

}

//

// third request
app.get('/trails', handelTrails);


function Trail(value){
    this.name = value.name;
    this.location = value.location;
    this.length = value.length;
    this.stars = value.stars;
    this.star_votes = value.starVotes;
    this.summary = value.summary;
    this.trail_url = value.url;
    this.conditions = value.conditionStatus;
    this.condition_date = ((value.conditionDate.toString()).split(' ')[0]);
    this.condition_time = ((value.conditionDate.toString()).split(' ')[1]);
}

function handelTrails(req, res) {


  superagent.get(`https://www.hikingproject.com/data/get-trails?lat=${req.query.latitude}&lon=${req.query.longitude}&maxDistance=200&key=${TRAIL_API_KEY}`)
    .then((value) => {
      let jsonObject = value.body.trails;

      
      let result =jsonObject.map((element)=>{
        return new Trail(element)
    })

      console.log(result);
      res.status(200).json(result);

    }).catch(() => {
      res.send('Sorry, something went wrong');
    });

}


//


function taskDate(dateMilli) {
  var d = (new Date(dateMilli) + '').split(' ');
  return [d[0], d[1], d[2], d[3]].join(' ');
}


//

app.listen(PORT, () => {
  console.log(`The App Port is ${PORT}`);

});
