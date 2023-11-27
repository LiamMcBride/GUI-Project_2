/*
    Liam McBride (mailmcbride)
    HW 5
*/

// Import mongoose library
const mongoose = require('mongoose');

// Create schema
const CS3744Schema = new mongoose.Schema({
    fileName: String,
    dataset: Object
});

// Export schema
module.exports = mongoose.model('CS3744Schema', CS3744Schema, 'Datasets_2');
