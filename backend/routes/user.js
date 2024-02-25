const express = require('express')
const { User,Account } = require('../db')
const router = express.Router()
const {JWT_SECRET} = require('../config.js')
const jwt = require('jsonwebtoken')
const { authMiddleware } = require('../middleware/authMiddleware.js')
const zod  = require('zod')
const mongoose = require('mongoose')
const {alreadyinDb} = require('../middleware/alreadyinDb.js')

const updateBody = zod.object({
    password: zod.string().min(6).optional(),
    firstName: zod.string().max(50).optional(),
    lastName: zod.string().max(50).optional(),
})

router.post('/signup',alreadyinDb,async(req,res)=>{
  const {username,password,firstName,lastName} = req.body
  console.log(username,password,firstName,lastName)
  const userDoc = new User({username,password,firstName,lastName})
  try{ 
    // transaction
    const session = await mongoose.startSession();
    session.startTransaction(); 

    const resp = await userDoc.save()
    if(!resp)throw new Error('cant save user doc')

    const token = jwt.sign({userId:userDoc._id},JWT_SECRET)  

    const acc = new Account({userId:  userDoc._id , balance:10_000 })
    const resp2= await acc.save()
    if(!resp2)throw new Error("cant make wallet")  

    await session.commitTransaction(); 

    session.endSession();

    return res.status(200).json({success:true , message:'user registered successfully',token})
  }catch(error){
    console.error(error)
    if (error instanceof mongoose.Error.WriteConflictError) {
      await session.abortTransaction();
      session.endSession();
      console.log("Write conflict occurred, retrying transaction...");
      await transfer(req);
    } else {
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction aborted:", error.message);
    }
    return res.status(411).json({message:'cant register user right now ,something went wrong'})
  }
})



router.post('/signin',async(req,res)=>{
  const {username,password} = req.body
  const template = zod.object({
    username : zod.string().min(3).max(30),
    password : zod.string().min(6), 
  })
  const result = template.safeParse({username,password})
  if(!result){
    return res.status(411).json({success:false ,message:'some feild missing out there'})
  }
  try{
    const resp = await User.findOne({username,password})
    if (!resp){
      return res.status(411).json({success:false , message:'username  or password is in correct'})
    }
    const uid = resp._id;
    const token = jwt.sign({userId:uid},JWT_SECRET)
    return res.status(200).json({success:true ,message:'login successfull',token})
  }catch(err){
    console.error(err)
    return res.status(411).json({success:false, message:'something went wrong in db'})
  }
})


router.put('/', authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body)
  if (!success) {
      return res.status(411).json({
          message: "Error while updating information"
      });
  }

  const userId = req.userId;

  const updateFields = {};
  for (const key in req.body) {
      if (req.body[key] !== null && req.body[key] !== undefined && key !== 'username') {
          updateFields[key] = req.body[key];
      }
  }
  
  if (Object.keys(updateFields).length === 0) {
      return res.status(200).json({
          message: "No fields to update"
      });
  }

  try {
      const result = await User.updateOne({_id:userId},{$set:updateFields});
      return res.status(200).json({
          message: "Updated successfully"
      });
  } catch (err) {
      console.error(err);
      return res.status(411).json({
          message: "Error while updating information"
      });
  }
});




router.get('/bulk',authMiddleware,async(req,res)=>{
  const filter = req.query.filter.toLocaleLowerCase()
  console.log('it is there',filter)
  try{
    const users = await User.find({
      $or: [{
          firstName: {
              "$regex": filter
          }
      }, {
          lastName: {
              "$regex": filter
          }
      }]
    })
    res.status(200).json({
      user: users.map(user => ({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          _id: user._id
      }))
    })
  }catch(err){
    console.error(err)
    res.status(411).json({message:'cant find'})
  }
})

module.exports =  router 