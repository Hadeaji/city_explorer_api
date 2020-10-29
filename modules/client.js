'use strict';

const pg = require('pg');

// start the server
const client = new pg.Client(process.env.DATABASE_URL);

module.exports = client;
