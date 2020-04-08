const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const app = express(); 

app.use(cors()); 
app.use(bodyParser.json());

const uri =  process.env.DB_PATH;
let client = new MongoClient(uri, { useNewUrlParser: true });

//Get
app.get('/' , (req, res) => {
  res.send("Welcome to Red Onion Server");
})

app.get("/food", (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("redOnion1").collection("foods");
    // perform actions on the collection object
    collection.find().toArray((err, documents) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        //console.log("successfully inserted");
        res.send(documents); 
      }
    });
    //console.log("database connected...");
    client.close();
  });
});

app.get("/food/:id", (req, res) => {
  console.log(req.query.sort);
  const id = req.params.id;
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("redOnion1").collection("foods");
    collection.find(id).toArray((err, documents) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        //console.log("successfully inserted", id);
        // console.log(documents[id]);

        res.send(documents[id]); 
      }
    });
    //console.log("database connected...");
    client.close();
  });
});

//post
app.post("/placeOrder", (req, res) => {
  const orderDetails = req.body;
  orderDetails.orderTime = new Date();
  // console.log(food);
  // database Connection
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("redOnion1").collection("placeOrder");
    // perform actions on the collection object
    collection.insertOne(orderDetails, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        //console.log("successfully inserted");
        res.send(result.ops[0]);
      }
    });
    //console.log("database connected...");
    client.close();
  });
});

//for inventory add
app.post('/addFood', (req, res) => {
  const food = req.body;
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
      const collection = client.db("redOnion1").collection("foods");
      collection.insert(food, (err, result) =>{
          if(err){
              console.log(err);
              res.status(500).send({message:err});
          }
          else {
              res.send(result.ops[0]);
          }
      });
      console.log('Database connected..');
      client.close();
  });
  console.log('data received',req.body);
});

const port = process.env.PORT || 3001;
app.listen(port, () => { 
  console.log("listening port " + port);
}); //listing port number
