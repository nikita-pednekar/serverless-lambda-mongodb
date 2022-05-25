const mongoose = require('mongoose');
const Promise = require('bluebird');
const ScratchCardModel = require('../model/ScratchCard.js');
const moment = require('moment');

mongoose.Promise = Promise;

const mongoString = process.env.MONGODB_STRING;

let cachedDB = null

async function connectToDatabase (uri, options = {}) {
  if (!cachedDB) cachedDB = await mongoose.connect(uri, { useMongoClient: true })
}

function buildResponse (statusCode, data) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(data)
  }
}

module.exports.createScratchCards = async (event, context) => {
  try {
    
    await connectToDatabase(mongoString)

    let numberOfScratchCards = Number(event.pathParameters.numberOfScratchCards);
    if (!numberOfScratchCards) return;

    const unusedScratchCardCount = await ScratchCardModel.count({ isScratched: false, status: 'active' });

    if (unusedScratchCardCount >= numberOfScratchCards) {
        return buildResponse(409, { message: `${unusedScratchCardCount} active scratch cards still exists in the DB. Did not create any new scratch cards` })
    }

    const scratchCardObjs = [];
    while (numberOfScratchCards) {
        const scratchCardObj = {
          discountAmount: parseInt(`${Math.floor((Math.random() * 1000)) / 50}`, 10) * 50,
          expiryDate: moment().add(5, 'days').toDate(),
          createdAt: moment()
        };
        scratchCardObjs.push(scratchCardObj);
        numberOfScratchCards--;
      }
    if (scratchCardObjs) await ScratchCardModel.insertMany(scratchCardObjs);

    return buildResponse(201, 'Scratch Cards Created');

  } catch (e) {
    return buildResponse(500, { message: e.message })
  }

};

module.exports.getUnusedScratchCards = async (event, context) => {
    try {
        await connectToDatabase(mongoString)

        const scratchCards = await ScratchCardModel.find({ isScratched: false, status: "active" });
        return buildResponse(200, scratchCards);
    } catch (e) {
        return buildResponse(500, { message: e.message })
    }
};