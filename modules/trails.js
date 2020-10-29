'use strict';

let superagent = require('superagent');

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


let trails = {
  trailsOfCity: function (req, res) {

    superagent.get(`https://www.hikingproject.com/data/get-trails?lat=${req.query.latitude}&lon=${req.query.longitude}&maxDistance=200&key=${process.env.TRAIL_API_KEY}`)
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

};

module.exports = trails;
