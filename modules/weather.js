'use strict';

let superagent = require('superagent');

function Weather(forecast, time) {
  this.forecast = forecast;
  this.time = time;
}

let weather = {

  weatherInfo: function (req, res) {

    superagent.get(`https://api.weatherbit.io/v2.0/forecast/daily?city=${req.query.search_query}&key=${process.env.WEATHER_API_KEY}`)
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
};

function taskDate(dateMilli) {
  var d = (new Date(dateMilli) + '').split(' ');
  return [d[0], d[1], d[2], d[3]].join(' ');
}


module.exports = weather;
