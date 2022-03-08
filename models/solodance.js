const mongoose = require('mongoose');
const SDSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }

});

const sd= mongoose.model('solodance',SDSchema);
module.exports = sd;