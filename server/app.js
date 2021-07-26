const express = require('express')
var cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const {MONGOURI} = require('./config/keys')


mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected',()=>{
    console.log("Connected to MongoDB via Mongoose")
})
mongoose.connection.on('error',(err)=>{
    console.log("Error connecting ",err)
})

// Register or add all models in app.js
require('./models/user')
require('./models/post')

app.use(cors())

app.use(express.json())
// Register all the routes in app.js
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log("Server running at port ",PORT)
})