const express = require("express");
const PORT = 5000; 
const cors = require('cors')
const app = express();
app.use(cors())
app.use(express.json())


const mainRouter = require("./routes/index.js")
app.use("/api/v1", mainRouter)
app.listen(PORT)
// const userRouter = require("./routes/user.js")
// app.use('/user',userRouter)
