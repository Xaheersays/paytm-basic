const {User} = require('../db')
const {userIpTemplate} =require('../zod.js')

const alreadyinDb = async(req,res,next)=>{
  const {username,password,firstName,lastName} = req.body
  
  const resp = userIpTemplate.safeParse({username,password,firstName,lastName})
  if(!resp.success){
    return res.json({ success:false ,message:'some feild is missing'})
  }
  try{
    const result = await User.findOne({username,firstName,lastName})
    if (result){
      return res.status(411).json({ success:false ,message:'username already register'})
      
    }
    next()
  }catch(err){
    console.error(err)
    return res.status(411).json({ success:false ,message:'something went wrong in db'})
  }
  
}

module.exports = {alreadyinDb}