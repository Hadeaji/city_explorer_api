'use strict';

let superagent = require('superagent');

function Rust(value) {
  this.name = value.name;
  this.image_url = value.image_url;
  this.price = value.price;
  this.rating = value.rating;
  this.url = value.url;
}

let page=1;

let yelp = {
  yelping: function (req, res) {
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
      .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
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
};

module.exports = yelp;
