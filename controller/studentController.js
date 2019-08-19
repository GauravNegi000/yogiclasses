var mongoose        = require('mongoose');
var Student         = require('../models/student');
var User            = require('../models/user');
var Thought         = require('../models/thought');

// Student Requests Controllers

// @get dashboard for student
module.exports.getDashboard     = (req, res) => {    
    Thought.find({},function(err, allThoughts) {    // getting thoughts posted
        if(err) res.redirect('back');

        else   res.render('dashboard/index', { active:'dashboard', thoughts: allThoughts });
    })
};

// @get profile page and details of student
module.exports.getProfile     = (req, res) => {
    Student.findById(req.user.studentId).populate('teacherAllot').populate({ path: 'courseAllot', populate: { path: 'courseAllot'}})
    .exec(function(err, foundStudent) {
        if(!foundStudent || err) {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('back');
        }   else {
            res.render('dashboard/profile', { student:foundStudent, active:'profile' });
        }
    });
};

// @add profile image
module.exports.addProfileImage   = (req, res) => {
    if( !req.fileValidationError ) {
        var imageFileName   = req.file.filename;
        var imageFileID     = req.file.id;
        Student.findById(req.params.id, function(err, foundStudent) {
            if (!foundStudent || err) {
                req.flash('error', 'Something Went Wrong..!');
                res.redirect('back');           
            }   else {
                User.findById(req.user._id, function(err, foundUser) {
                    if(!foundUser || err) {
                        req.flash('error', 'Something Went Wrong..!');
                        res.redirect('back');  
                    }   else {
                            foundStudent.image.fileName = imageFileName;
                            foundStudent.image.fileId = imageFileID;
                            foundStudent.save();
                            foundUser.image.fileName = imageFileName;
                            foundUser.image.fileId = imageFileID;
                            foundUser.save();
                            req.flash('success', 'Task Done Successfully..!');
                            res.redirect('back');
                    }
                })
            }
        });
    } else {
       
            req.flash('error', 'File Type Error..!');
            res.redirect('back');     
    }
}


// @get Notes
module.exports.getNotes     = (req, res) => {
    Student.findById(req.user.studentId, function(err, foundStudent) {
        if(!foundStudent || err) {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('back'); 
        }   else {
            res.render('dashboard/notes', { student: foundStudent, active:'notes' });
        }
    })
};

// @delete notes from the student
module.exports.deleteNotes  = (req, res) => {
    let noteId = req.params.id;
    Student.findById(req.user.studentId, function(err, foundStudent) {
        if(!foundStudent || err) {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('back'); 
        }   else {
            foundStudent.notes.forEach((note) => {
                if(note._id == noteId) foundStudent.notes.pop(note);
            });
            foundStudent.save();
            req.flash('success', 'Task Done Successfully..!');
            res.redirect('back');
        }
    })
}


// @Transactions page
module.exports.getTransactions     = (req, res) => {
    Student.findById(req.user.studentId, function(err, foundStudent) {
        if(!foundStudent || err) {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('back'); 
        }   else {
            res.render('dashboard/transactions', { student:foundStudent, active:'transactions' });
        }
    });
};