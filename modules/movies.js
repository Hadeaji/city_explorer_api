'use strict';

let superagent = require('superagent');

function Movie(value) {
  this.title = value.title;
  this.overview = value.overview;
  this.average_votes = value.vote_average;
  this.total_votes = value.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${value.poster_path}`;
  this.popularity = value.popularity;
  this.released_on = value.release_date;
}

let movies = {
  moviesAbout: function (req, res) {

    superagent.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${req.query.search_query}`)
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
  }};

module.exports = movies;
