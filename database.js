const mongoose = require('mongoose')
//Schema
const customersSchema = new mongoose.Schema({
    fullName: String,
    email:String,
    contact:Number,
    otp:Number,
    cart:Array
}); 

const restaurantSchema = new mongoose.Schema({
    Name: String,
    Menu:Array,
    Location:String
});

//Creating a model
const Customer = mongoose.model('Customer',customersSchema)
const Restaurant = mongoose.model('Restaurants',restaurantSchema)
module.exports = {Customer,Restaurant}