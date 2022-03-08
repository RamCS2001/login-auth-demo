const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    eventName: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }

});

const event= mongoose.model('event',EventSchema);
module.exports = event;