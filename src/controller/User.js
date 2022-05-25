const mongoose = require('mongoose');
const Promise = require('bluebird');
const UserModel = require('../model/User.js');

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

module.exports.getUser = async (event, context) => {
  try {

    await connectToDatabase(mongoString)

    const user = await UserModel.find({ _id: event.pathParameters.id });
    return buildResponse(200, user[0]);

  } catch (e) {
    return buildResponse(500, { message: e.message })
  }
}

module.exports.listUsers = async (event, context) => {
  try {

    await connectToDatabase(mongoString)

    const users = await UserModel.find();
    return buildResponse(200, users);

  } catch (e) {
    return buildResponse(500, { message: e.message })
  }
};


module.exports.createUser = async (event, context) => {
  try {
    
    await connectToDatabase(mongoString)

    const data = JSON.parse(event.body);
    const user = new UserModel({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      status: 'active',
      createdAt: new Date()
    });

    if (user.validateSync()) {
      return buildResponse(400, { message: 'Incorrect user data' })
    }

    await user.save();
    return buildResponse(200, user);

  } catch (e) {
    return buildResponse(500, { message: e.message })
  }

};

module.exports.deleteUser = async (event, context) => {
  try {

    await connectToDatabase(mongoString)

    const user = await UserModel.remove({ _id: event.pathParameters.id });
    return buildResponse(200, { message: 'User deleted.' });

  } catch (e) {
    return buildResponse(500, { message: e.message })
  }

};

module.exports.updateUser = async (event, context) => {
  try {
    
    await connectToDatabase(mongoString)

    const data = JSON.parse(event.body);
    const id = event.pathParameters.id;

    const user = new UserModel({
      _id: id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName
    });

    if (user.validateSync()) {
      return buildResponse(400, { message: 'Incorrect user data' })
    }

    await UserModel.findByIdAndUpdate(id, user);
    return buildResponse(200, user);

  } catch (e) {
    return buildResponse(500, { message: e.message })
  }

};

module.exports.updateStatus = async (event, context) => {
  try {

    await connectToDatabase(mongoString)
    
    const data = JSON.parse(event.body);

    let error; let message = '';
    if (!data.users.length) { error = 1; message = 'Please select users'; }

    if (!error && !data.status) { error = 1; message = 'Status is required'; }

    if (error === 1) return buildResponse(400, { message: message })

    var ops = [];
    data.users.forEach(function(user) {
        ops.push({
            "updateOne": {
                "filter": { "_id": user },
                "update": {
                    "$set": { "status": data.status }
                }
            }
        });
    })

    const users = await UserModel.bulkWrite(ops);
    return buildResponse(200, { message: 'Users updated.' });

  } catch (e) {
    return buildResponse(500, { message: e.message })
  }

};
