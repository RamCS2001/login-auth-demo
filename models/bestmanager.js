const mongoose = require('mongoose');
const BMSchema = new mongoose.Schema({

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

const bm= mongoose.model('bestmanager',BMSchema);
module.exports = bm;