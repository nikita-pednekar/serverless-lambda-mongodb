const mongoose = require('mongoose');
const Promise = require('bluebird');

mongoose.Promise = Promise;

const mongoString = process.env.MONGODB_STRING;

let cachedDB = null

async function connectToDatabase (uri, options = {}) {
  if (!cachedDB) cachedDB = await mongoose.connect(uri, { useMongoClient: true })
}

module.exports = connectToDatabase;