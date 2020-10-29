'use strict';

// dependencies
let express = require('express');
let cors = require('cors');

require('dotenv').config();

// importing

const client = require('./modules/client.js');
const location = require('./modules/location.js');
const weather = require('./modules/weather.js');
const trails = require('./modules/trails.js');
const movies = require('./modules/movies.js');
const yelp = require('./modules/yelp.js');

// setup
const PORT = process.env.PORT;
let app = express();
app.use(cors());

// dependencies
app.get('/location', handelGettingPeopleData);
app.get('/weather', handelWeather);
app.get('/trails', handelTrails);
app.get('/movies', handelMovies);
app.get('/yelp',handelRust);
app.get('/*',handelError);


// info about the city providing and getting it from DB if avaliable

function handelGettingPeopleData(req, res) {
  let city = req.query.city;
  client.query(`SELECT search_query, formatted_query, latitude, longitude FROM locations WHERE search_query = '${city}'`).then((data) => {
    if (data.rowCount === 0) {
      location.handelLocation(city, res);
    } else {
      res.status(200).json(data.rows[0]);
      console.log('Got Data From Database');
    }
  });
}

// weather providing

function handelWeather(req, res) {
  weather.weatherInfo(req, res);
}

// trails providing

function handelTrails(req, res) {
  trails.trailsOfCity(req, res);
}

// movies providing

function handelMovies(req, res) {
  movies.moviesAbout(req, res);
}

// yelp function

function handelRust(req, res) {
  yelp.yelping(req, res);
}


// error messege
function handelError(req, res) {
  res.status(404).send('404 Not Found');
}



// port ready to listen
client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`The App Port is ${PORT}`);
  });
});
