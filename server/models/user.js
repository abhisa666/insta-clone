const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],
    pic:{
        type:String,
        default:"https://res.cloudinary.com/dzcubxzg9/image/upload/v1616171699/22-223965_no-profile-picture-icon-circle-member-icon-png_g480ow.png"
    },
    resetToken:String,
    expireToken:Date

})

mongoose.model("User",userSchema)