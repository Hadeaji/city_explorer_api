'use strict';

const client = require('./client.js');
let superagent = require('superagent');

function Location(search_query, formatted_query, latitude, longitude) {
  this.search_query = search_query;
  this.formatted_query = formatted_query;
  this.latitude = latitude;
  this.longitude = longitude;
}

let location = {

  handelLocation: function (city, res) {
    superagent.get(`https://eu1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`)
      .then((data) => {
        let jsonObject = data.body[0];
        let locationObject = new Location(city, jsonObject.display_name, jsonObject.lat, jsonObject.lon);
        res.status(200).json(locationObject);

        // insert data to database
        client.query(`INSERT INTO locations(search_query, formatted_query, latitude, longitude) values ('${locationObject.search_query}', '${locationObject.formatted_query}','${locationObject.latitude}', '${locationObject.longitude}')`);
      })

      .catch(() => {
        res.send('Sorry, something went wrong');
      });
  },
};

module.exports = location;
