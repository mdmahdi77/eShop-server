const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()


const port = process.env.PORT || 8000

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})


// const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.h25va.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("sShopStore").collection("products");
    const ordersCollection = client.db("sShopStore").collection("orders");
    const reviewCollection = client.db("sShopStore").collection("review");
    const adminCollection = client.db("sShopStore").collection("admin");

    app.post('/addProducts', (req, res) => {
        const product = req.body
        productCollection.insertMany(product)
            .then(result => {
                console.log(result)
            })
    })

    app.get("/products", (req, res) => {
        productCollection.find({})
        .toArray((err, product) =>{
            res.send(product)
        })
    })

    app.post('/submitOrders', (req, res) => {
        const order = req.body
        ordersCollection.insert(order)
        .then(result => {
            console.log(result)
        })
    })

    app.get('/ordersList', (req, res) => {
        ordersCollection.find({email: req.query.email})
        .toArray((err, order) => {
            res.send(order)
        })
    })
    app.get('/orders', (req, res) => {
        ordersCollection.find({})
        .toArray((err, order) => {
            res.send(order)
        })
    })

    app.post('/addReview', (req, res) => {
        const review = req.body
        reviewCollection.insert(review)
        .then(result => {
            res.send(result)
            console.log(result.insertedCount > 0)
        })
    })

    app.get('/review', (req, res) => {
        reviewCollection.find({})
        .toArray((err, document) => {
            res.send(document)
        })
    })

    app.post('/addAdmin', (req, res) => {
        const admin = req.body
        adminCollection.insert(admin)
        .then(result => {
            res.send(result)
            console.log(result.insertedCount > 0)
        })
    })

    app.post('/isAdmin', (req, res) => {
        const admin = req.body.email
        adminCollection.find({email: admin})
        .toArray((err, document) => {
            res.send(document.length > 0)
        })
    })

});


app.listen(process.env.PORT || port)