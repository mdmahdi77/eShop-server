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

});


app.listen(process.env.PORT || port)