const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const port = 4000

app.use(bodyParser.json());
app.use(cors());
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const e = require('express');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tx9ov.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log(err)
  const odderList = client.db("Creative-Agency").collection("odderList");
  const clientReview = client.db("Creative-Agency").collection("clientReview");
  const addAdmin = client.db("Creative-Agency").collection("admin");
  const addService = client.db("Creative-Agency").collection("Service");
  // perform actions on the collection object
  console.log("database connect");
  app.post('/customerOdder', (req, res) => {
    const odder = req.body;
    odderList.insertOne(odder)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  });


  app.post('/odderList', (req, res) => {
    //  console.log(req.body);
    //  console.log(req.headers.authorization);
    const email = req.body;
    odderList.find({ email: email.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  });

  app.post('/clientReview', (req, res) => {
    const review = req.body;
    clientReview.insertOne(review)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/reviewList', (req, res) =>{
    clientReview.find({})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })
  app.post('/addService', (req, res) =>{
    const service = req.body;
    addService.insertOne(service)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/serviceList', (req, res) =>{
    addService.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
  app.get('/review', (req, res) => {
    clientReview.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.post('/addAdmin', (req, res) => {
    const admin = req.body;
    addAdmin.insertOne(admin)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/clientOdder', (req, res) => {
    const email = req.body;
    console.log(email);
    addAdmin.find({ email: email.email })
     .toArray((err, costomerOdder) =>{
       if(costomerOdder.length){
        odderList.find({})
        .toArray((err, documents) =>{
          res.send(documents)
        })
       }
       
     })


  })

});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})