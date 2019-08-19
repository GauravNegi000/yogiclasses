var Teacher         = require('../models/teacher');
var Thought         = require('../models/thought');
var User            = require('../models/user');
var Student         = require('../models/student');

// Teacher Requests Controllers

// @get dashboard for teacher
module.exports.getDashboard     = (req, res) => {
    Teacher.findById(req.user.teacherId).populate({ path: 'studentAlloted', populate: { path: 'studentAlloted'}})
    .exec(function(err, foundTeacher) {             // populating students alloted to teacher
        if(!foundTeacher || err) {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('back');  
        }   else {
            Thought.find({}, function(err, allThoughts) {    // getting thoughts posted
                if(err) res.redirect('back');
        
                else   res.render('dashboard/index', { active:'dashboard', teacher:foundTeacher, thoughts: allThoughts });
            }); 
        }
    });
};

// @get profile page and details of teacher
module.exports.getProfile     = (req, res) => {
    Teacher.findById(req.user.teacherId, function(err, foundTeacher) {
        if(!foundTeacher || err) {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('back');
        }   else {
            res.render('dashboard/profile', { teacher:foundTeacher, active:'profile' });
        }
    })
};

// @add profile image
module.exports.addProfileImage   = (req, res) => {
    if( !req.fileValidationError ) {
        var imageFileName   = req.file.filename;
        var imageFileID     = req.file.id;
        Teacher.findById(req.params.id, function(err, foundTeacher) {
            if (!foundTeacher || err) {
                req.flash('error', 'Something Went Wrong..!');
                res.redirect('back');           
            }   else {
                User.findById(req.user._id, function(err, foundUser) {
                    if(!foundUser || err) {
                        req.flash('error', 'Something Went Wrong..!');
                        res.redirect('back');  
                    }   else {
                            foundTeacher.image.fileName = imageFileName;
                            foundTeacher.image.fileId = imageFileID;
                            foundTeacher.save();
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
    Teacher.findById(req.user.teacherId, function(err, foundTeacher) {
        if(!foundTeacher || err) {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('back'); 
        }   else {
            res.render('dashboard/notes', { teacher: foundTeacher, active:'notes' });
        }
    });
};

// @delete notes from the student
module.exports.deleteNotes  = (req, res) => {
    let noteId = req.params.id;
    Teacher.findById(req.user.teacherId, function(err, foundTeacher) {
        if(!foundTeacher || err) {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('back'); 
        }   else {
            foundTeacher.notes.forEach((note) => {
                if(note._id == noteId) foundTeacher.notes.pop(note);
            });
            foundTeacher.save();
            req.flash('success', 'Task Done Successfully..!');
            res.redirect('back');
        }
    })
}

// @sent notes to the server[ by middleware ] and save the filename in student and teacher 
module.exports.sentNotes    = (req, res) => {
    if( !req.fileValidationError ) {
        Teacher.findById(req.user.teacherId, function(err, foundTeacher) {
            if(!foundTeacher || err) {
                req.flash('error', 'Something Went Wrong..!');
                res.redirect('back');  
            }   else {
            Student.findById(req.params.id, function(err, foundStudent) {
                if(!foundStudent || err) {
                        req.flash('error', 'Something Went Wrong..!');
                        res.redirect('back');    
                }    else {
                        var notesStudent = { title: req.body.title, sender: foundTeacher.name, fileName: req.file.filename }
                        var notesTeacher = { title: req.body.title, receiver: foundStudent.name, fileName: req.file.filename }
                        foundStudent.notes.push(notesStudent);
                        foundTeacher.notes.push(notesTeacher);
                        foundStudent.save();
                        foundTeacher.save();
                        req.flash('success', 'Task Done Successfully..!');
                        res.redirect('back');
                }
            }); 
            }
        });
    }   else {
        req.flash('error', 'File Type Error..!');
        res.redirect('back');  
    }
}

// @Transactions page
module.exports.getTransactions     = (req, res) => {
    Teacher.findById(req.user.teacherId, function(err, foundTeacher) {
        if(!foundTeacher || err) {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('back'); 
        }   else {
            res.render('dashboard/transactions', { teacher:foundTeacher, active:'transactions' });
        }
    });
};