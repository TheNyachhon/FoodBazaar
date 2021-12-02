const express = require('express')
const app = express()

const path = require('path');
require('dotenv').config()

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')

// Database connection
const mongoose = require('mongoose');
const { Customer } = require('./database')
const { Restaurant } = require('./database')
mongoose.connect('mongodb://localhost:27017/FoodBazaar')
    .then(() => {
        console.log("Connection open!!");
    })
    .catch(err => {
        console.log("Connection failed!: ");
        console.log(err);
    })

//redirection to login page
app.get('/login', (req, res) => {
    const otp = req.query
    res.render('login', { otp })
    //if otp is sent , then in login page, display the enter otp section
})
//after user inputs phone number, user is displayed otp section
app.post('/login', async (req, res) => {
    const otp = req.query
    console.log(otp)
    const phone = req.body.phone
    console.log(phone)
    const random = Math.floor(Math.random() * 8999 + 1000)
    // const customer = await Customer.findOne({ contact: phone })
    await Customer.findOneAndUpdate({ contact: phone }, { otp: random })
        .then(async (customer) => {
            if (customer == null) {
                const newCustomer = new Customer({
                    contact: phone,
                    otp: random
                })
                newCustomer.save()
            }
            console.log('here')
            setTimeout(async () => {
                await Customer.findOne({ contact: phone })
                    .then(customer => {
                        console.log(customer)
                        console.log("OTP is " + random)
                        res.render('login', { otp, phone, customer })
                    })
                    .catch(e => {
                        console.log(e)
                    })
            }, 1000)
        })
        .catch(e => {
            console.log("error")
            // console.log(e)
        })
})
app.get('/restaurants', async (req, res) => {
    const id = req.query
    console.log(id)
    const customer = await Customer.findOne({ _id: id.userid })
    //extracting restuarants data
    const restaurants = await Restaurant.find({});
    res.render('restaurants', { restaurants, customer })
})
app.post('/restaurants', async (req, res) => {
    const otp = req.body.otp
    const phone = req.body.phone
    //Customer data
    const customer = await Customer.findOne({ contact: phone })
    //extracting restuarants data
    const restaurants = await Restaurant.find({});
    // console.log(restaurants)
    await Customer.findOne({ contact: phone })
        .then(d => {
            if (d.otp == otp) {
                res.render('restaurants', { restaurants, customer })
            } else {
                res.redirect('/login')
            }
        })
        .catch(e => {
            console.log('error')
        })

})
app.get('/menu', async (req, res) => {
    const { userid, id, item, price } = req.query
    const customer = await Customer.findOne({ _id: userid })
    // console.log(userid);
    // console.log(id);
    await Restaurant.findOne({ _id: id })
        .then(async (restaurant) => {
            if (item) {
                var itemID = mongoose.Types.ObjectId();
                await Customer.findOneAndUpdate({ _id: userid }, { $push: { cart: { _id: itemID, Restaurant: restaurant.Name, Item: item, Price: price } } })
                    .then(async () => {
                        console.log("Added to cart")
                        res.redirect('?userid=' + userid + '&id=' + id)
                    })
            }
            res.render('menu', { restaurant, customer })
        })
        .catch(e => {
            console.log('error')
            // console.log(e)
        })

})
//Deleteing items from cart
app.get('/delete', async (req, res) => {
    const { userid, id, itemID } = req.query
    await Customer.findOne({ _id: userid })
        .then(async (d) => {
            let idToDelete
            for(let x of d.cart){
                if(x._id==itemID){
                    idToDelete=x._id
                    break
                }
            }
            await Customer.findOneAndUpdate({ _id: userid }, { $pull: { cart: { _id: idToDelete } } }, { safe: true, multi: true })
                .then(d => {
                    console.log("item deleted")
                })
        })
    res.redirect('/menu?userid=' + userid + '&id=' + id)
})
//id will be passed below 
app.get('/selectvendor', async (req, res) => {
    const { userid } = req.query
    const customer = await Customer.findOne({ _id: userid })
    res.render('vendors', { customer })
})
app.get('/checkout', async (req, res) => {
    const { vendor, userid } = req.query
    console.log(vendor)
    const customer = await Customer.findOne({ _id: userid })
    // res.render('checkout',{id,vendor})
    res.render('checkout', { vendor, customer })

})
app.get('/logout', (req, res) => {
    res.redirect('login?logout=successful')
})
app.get('/', (req, res) => {
    res.redirect('/login')
})
app.get('*', (req, res) => {
    res.send('woops! you look lost.')
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})