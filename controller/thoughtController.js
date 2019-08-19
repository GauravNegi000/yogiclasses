var Thought     = require('../models/thought');

// Thought Controller [ By admin ]

// @post thought 
module.exports.postThought      = (req, res) => {
    var newThought = { text: req.body.text, author: req.body.author };

    Thought.create(newThought, function(err, thought){
        if(err) {
            req.flash('error', 'Something Went Wrong..!');         
            res.redirect('back');
        }   else {
            req.flash('success', 'Successfully Posted..!');            
            res.redirect('/dashboard/admin/');
        }
    })
}

// @delete thought
module.exports.deleteThought    = (req, res) => {
    Thought.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            req.flash('error', 'Something Went Wrong..!');            
            res.redirect('back');
        }   else {
            req.flash('success', 'Successfully Posted..!');            
            res.redirect('back');
        }
    })
}