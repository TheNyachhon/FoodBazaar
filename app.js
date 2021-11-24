const express = require('express')
const app = express()

const path = require('path');
require('dotenv').config()

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine','ejs')

// Database connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/FoodBazaar')
    .then(() => {
        console.log("Connection open!!");
    })
    .catch(err => {
        console.log("Connection failed!: ");
        console.log(err);
    })

app.get('/checkout',(req,res)=>{
    res.render('vendors')
})
app.get('*',(req,res)=>{
    res.send('woops! you look lost.')
})

app.listen(3000,()=>{
    console.log("Listening on port 3000")
})