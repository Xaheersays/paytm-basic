const express = require('express')
const { User,Account } = require('../db')
const router = express.Router()
const z = express('zod')
const {JWT_SECRET} = require('../config.js')
const jwt = require('jsonwebtoken')
const { authMiddleware } = require('../middleware/authMiddleware.js')
const zod  = require('zod')
const mongoose = require('mongoose')


router.get('/balance',authMiddleware,async(req,res)=>{
  const userId = req.userId
  try{
    const acc = await Account.findOne({userId})
      return res.status(200).json({success:true,message:'balance fetched successfully' ,balance:acc.balance})
  }catch(err){
    console.error(err)
    return res.status(403).json({success:false , message:'cant fetch balance'})
  }
})

router.post('/transfer', authMiddleware, async (req, res) => {
  const fromUserId = req.userId;
  const toUserId = req.body.to;
  console.log(fromUserId, toUserId);
  const amount = parseInt(req.body.amount);
  let session;

  try {
    // Start a new session
    session = await mongoose.startSession();

    // Transaction initialization
    session.startTransaction();

    if (!mongoose.isValidObjectId(fromUserId) || !mongoose.isValidObjectId(toUserId)) {
      console.log('Invalid data received');
      throw new Error('Invalid data received');
    }

    // Operations
    const fromUserDoc = await Account.findOne({ userId: fromUserId }).session(session);
    const toUserDoc = await Account.findOne({ userId: toUserId }).session(session);

    // Check if user documents are found
    if (!fromUserDoc || !toUserDoc) {
      throw new Error('Either sender or recipient account is wrong');
    }

    // Check if sender has sufficient balance
    if (fromUserDoc.balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Perform transaction
    fromUserDoc.balance -= amount;
    toUserDoc.balance += amount;

    await fromUserDoc.save({ session });
    await toUserDoc.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.json({ success: true, message: 'Transaction successful',balance:fromUserDoc.balance });
  } catch (error) {
    console.error(error);

    // Check if session is still open and end it
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }

    // Handle session expiration error
    if (error.name === 'MongoExpiredSessionError') {
      console.log('Session expired, retrying transaction...');
      await transfer(req); // Retry the transaction
      return;
    }

    return res.status(500).json({ success: false, message: 'Transaction failed' });
  }
});


module.exports = router