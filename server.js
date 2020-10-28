// statics
let express = require('express');
let cors = require('cors');
let superagent = require('superagent');
let pg = require('pg');

let app = express();
app.use(cors());

require('dotenv').config();

const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const TRAIL_API_KEY = process.env.TRAIL_API_KEY;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const YELP_API_KEY = process.env.YELP_API_KEY;

let client = new pg.Client(DATABASE_URL);
//

// first request
app.get('/location', handelGettingPeopleData);


function handelGettingPeopleData(req, res) {
  let city = req.query.city;
  client.query(`SELECT search_query, formatted_query, latitude, longitude FROM locations WHERE search_query = '${city}'`).then((data) => {
    if (data.rowCount === 0) {
      handelLocation(city, res);
    } else {
      res.status(200).json(data.rows[0]);
      console.log('Got Data From Database');
    }
  });
}


function handelLocation(city, res) {

  // let jsonData = require('./data/location.json');
  superagent.get(`https://eu1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${city}&format=json`)
    .then((data) => {
      let jsonObject = data.body[0];
      let locationObject = new Location(city, jsonObject.display_name, jsonObject.lat, jsonObject.lon);
      res.status(200).json(locationObject);

      // insert data to database
      client.query(`INSERT INTO locations(search_query, formatted_query, latitude, longitude) values ('${locationObject.search_query}', '${locationObject.formatted_query}','${locationObject.latitude}', '${locationObject.longitude}')`);
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

      let result = jsonObject.map((element) => {
        return new Weather(element.weather.description, taskDate(Date.parse(element.datetime)));
      });

      res.status(200).json(result);

    }).catch(() => {
      res.send('Sorry, something went wrong');
    });

}

//

// third request
app.get('/trails', handelTrails);


function Trail(value) {
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


      let result = jsonObject.map((element) => {
        return new Trail(element);
      });

      console.log(result);
      res.status(200).json(result);

    }).catch(() => {
      res.send('Sorry, something went wrong');
    });

}


//
// movies

app.get('/movies', handelMovies);

function handelMovies(req, res) {


  superagent.get(`https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${req.query.search_query}`)
    .then((value) => {
      let jsonObject = value.body.results;


      let result = jsonObject.map((element) => {
        return new Movie(element);
      });

      console.log(result);
      res.status(200).json(result);

    }).catch(() => {
      res.send('Sorry, something went wrong');
    });

}

function Movie(value) {
  this.title = value.title;
  this.overview = value.overview;
  this.average_votes = value.vote_average;
  this.total_votes = value.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${value.poster_path}`;
  this.popularity = value.popularity;
  this.released_on = value.release_date;

}

//

// movies

app.get('/yelp',handelRust);

let page=1;
function handelRust(req, res) {

  const numPerPage =5;
  const start =((page -1) * numPerPage +1);
  page++;


  const queryParams = {
    location:req.query.search_query,
    limit: numPerPage,
    offset:start,

  };


  superagent.get(`https://api.yelp.com/v3/businesses/search`)
    .query(queryParams)
    .set('Authorization',`Bearer ${process.env.YELP_API_KEY}`)
    .then((value) => {
      let jsonObject = value.body.businesses;


      let result = jsonObject.map((element) => {
        return new Rust(element);
      });

      console.log(result);
      res.status(200).json(result);

    }).catch(() => {
      res.send('Sorry, something went wrong');
    });

}

function Rust(value) {

  this.name=value.name;
  this.image_url=value.image_url;
  this.price=value.price;
  this.rating=value.rating;
  this.url=value.url;

}

//




function taskDate(dateMilli) {
  var d = (new Date(dateMilli) + '').split(' ');
  return [d[0], d[1], d[2], d[3]].join(' ');
}


//
client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`The App Port is ${PORT}`);
  });
});
