const mongoose = require('mongoose')
//Schema
const customersSchema = new mongoose.Schema({
    fullName: String,
    email:String,
    contact:Number,
    otp:Number,
    cart:Array
}); 

//Creating a model
const Customer = mongoose.model('Customer',customersSchema)
module.exports = Customer