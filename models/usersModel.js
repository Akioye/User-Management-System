const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:String,
    gender:String,
    email:String,
    plan:String,
    fee:Number,
    view:Number,
    nin:Number
}) 
module.exports = new mongoose.model('user',userSchema)