var mongoose = require('mongoose');

var thoughtSchema   = new mongoose.Schema({

        text: String,
        author: String

});

module.exports  = mongoose.model('Thought', thoughtSchema);