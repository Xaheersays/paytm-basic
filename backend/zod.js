const z= require('zod')
const userIpTemplate = z.object({
  username : z.string().min(3).max(30),
  password : z.string().min(6),
  firstName:z.string().max(50),
  lastName:z.string().max(50)
})


module.exports = {userIpTemplate}