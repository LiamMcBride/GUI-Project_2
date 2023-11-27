/*
    Liam McBride (mailmcbride)
    HW 5
*/

// Import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Set the web server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.get('/', (req, res) =>
    res.send('<h1>Homework 5 Express Backend</h1>') // Home web page
);

// Connect to MongoDB database
mongoose.Promise = global.Promise;
//connection string
mongoose.connect('mongodb+srv://student:cs3744@cs3744.ppgoanh.mongodb.net/CS3744?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once("open", function() {
  console.log("Connection with MongoDB was successful");
});

// Create routes for database access
const tableSchema = require("./model");
const router = express.Router();

//db endpoint
app.use('/db', router);

//db/find endpoint
router.route('/find').get( (req, res) => {
  console.log(`Request made: \n${req}`) //log that a request was made
  tableSchema.find().then(function(items, err) {
    if (err) {
      console.log(err);
      res.status(500).send('Internal Server Error'); //signal server error if this fails
    } else {
      res.json(items); //else just forward response
    }
  });
});
router.route('/find/:caption').get(function(req, res) {
  tableSchema.find().then({caption: req.params.caption}, function(err, items) {
    res.json(items);
  });
});

router.route('/update/:id').post( (req, res) => {
  console.log("Post Request made:")
  tableSchema.findById(req.params.id).then(function(items, err) {
    if (err) {
      console.log(err);
    }
    else {
      items.caption = "";
      items.datasets = req.body;
      items.save().then(items => {
        res.json('Items updated!');
      })
          .catch(err => {
            res.status(400).send("Update not possible");
          });
    }
  });
});

// Export the app to be used in bin/www.js
module.exports = app;
