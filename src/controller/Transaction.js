const  connectToDatabase  = require('../config/db.js');
const moment = require('moment');
var ObjectId = require('mongodb').ObjectID;
const  {  UserModel, 
          ScratchCardModel, 
          TransactiondModel }  = require('../model/index.js');
const  buildResponse  = require('../util/response.js');

const mongoString = process.env.MONGODB_STRING;

module.exports.createTransactions = async (event, context) => {
  try {
    
    await connectToDatabase(mongoString)

    const { userId, scratchCardId } = JSON.parse(event.body);

    if(!userId || !scratchCardId) return buildResponse(400, { message: 'All fields are required' });

    const user = await UserModel.find({ _id: userId, status: 'active' });
        
    if (!user.length) return buildResponse(400, { message: 'User not found' });

    const scratchCard = await ScratchCardModel.find({ _id: scratchCardId, expiryDate: { $gt: moment().subtract(1, 'days').toDate() }, isScratched: false, status: 'active' });

    if (!scratchCard.length) return buildResponse(400, { message: 'Scratch card not found' });

    const transaction = new TransactiondModel({
        transactionAmount: scratchCard[0].discountAmount,
        dateOfTransaction: moment().format('YYYY-MM-DD'),
        userId: userId,
        scratchCardId: scratchCardId
    });
    if (transaction.validateSync()) {
        return buildResponse(400, { message: 'Incorrect transaction data' })
    }

    const createdTransaction = await transaction.save();

    if (createdTransaction) await ScratchCardModel.findByIdAndUpdate(scratchCardId, { isScratched: true });
    return buildResponse(200, createdTransaction);

  } catch (e) {
    return buildResponse(500, { message: e.message })
  }

};

module.exports.getAllTransactions = async (event, context) => {
    try {
        await connectToDatabase(mongoString)
        
        const { userId, transactionAmount } = event.queryStringParameters;
       
        let aggregateCondition = [];
        aggregateCondition.push({
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user"
            }
        });

        if(userId) {
            aggregateCondition.push({ $match: { userId: ObjectId(userId) } } )
        }

        if(transactionAmount) {
            aggregateCondition.push({ $match: { transactionAmount: Number(transactionAmount) } } )
        }

        transactions = await TransactiondModel.aggregate(aggregateCondition);
        return buildResponse(200, transactions);
    } catch (e) {
        return buildResponse(500, { message: e.message })
    }
};