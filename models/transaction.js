var mongoose    = require('mongoose');

var transactionSchema   = new mongoose.Schema({
        name:    String,
        role:    String,
        amount:  String,
        paid:    String,
        pmode:   String,
        created: {type:Date, default:Date.now},
        isActive: { type:Boolean, default: true }
});

module.exports  = mongoose.model('Transaction', transactionSchema);