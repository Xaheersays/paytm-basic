const mongouri = 'mongodb+srv://shzaheer514:zaheer514@cluster0.jgq64hk.mongodb.net/paytm'
const mongoose = require('mongoose')
mongoose.connect(mongouri)

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30
  },
  password: {
      type: String,
      required: true,
      minLength: 6
  },
  firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50
  },
  lastName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50
  }

})


const User = mongoose.model('users',userSchema)


const accountSchema = mongoose.Schema({
  userId : {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  balance:{type:Number,required:true}
})

const Account = mongoose.model('accounts',accountSchema)

module.exports = {
  User,Account
}
