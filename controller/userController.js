var User            = require('../models/user');
var passport        = require('passport');
var Student         = require('../models/student');
var Teacher         = require('../models/teacher');

// User Controllers

// @sign up for admin [ creating admin user account ] by admin
module.exports.signupAdmin      = ( req, res ) => {
    var newUser = new User({
        username: req.body.username.toLowerCase(),
        name: req.body.name.toUpperCase(),
        role: 'admin',
        isActive: true        
    });
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('back');
        }   else {
           passport.authenticate('locals')(req, res, function() {
               res.redirect('/dashboard/admin');
           });
        }
    });
}

// @sign up student [ creating student user account ] by admin
module.exports.signupStudent       = ( req, res ) => {
    Student.findById(req.params.id, function(err, foundStudent) {
        if(!foundStudent || err) {
            req.flash('error', 'Something Went Wrong..!');                          
            res.redirect('back');
        }   else {
            var newUser = new User({
                username: foundStudent.emailId.toLowerCase(),
                role: 'student',
                name:  foundStudent.name,
                studentId: foundStudent._id,
                isActive: true
            });
            var password = foundStudent.name.replace(/\s/g, '').toLowerCase() + foundStudent.mobile.substr(0, 4);         
            User.register(newUser, password, function(error, user) {
                if(error) {
                    req.flash('error', error.message);  
                    res.redirect('back');
                }   else {
                    foundStudent.hasAccount = true;
                    foundStudent.save();
                    passport.authenticate('locals')(req, res, function() {
                    req.flash('success', 'Task Done Successfully..!');
                    res.redirect('back');
                   });
                }
            });
        }
    })
    
}

// @sign up teacher [ creating teacher user account ] by admin
module.exports.signupTeacher       = ( req, res ) => {
    Teacher.findById(req.params.id, function(err, foundTeacher) {
        if(!foundTeacher || err) {
            req.flash('error', 'Something Went Wrong..!');              
            res.redirect('back');
        }   else {
            var newUser = new User({
                username: foundTeacher.emailId.toLowerCase(),
                role: 'teacher',
                name:  foundTeacher.name,
                teacherId: foundTeacher._id,
                isActive: true
            });
            var password = foundTeacher.name.replace(/\s/g, '').toLowerCase() + + foundTeacher.mobile.substr(0, 4);;         
            User.register(newUser, password, function(error, user) {
                if(error) {
                    req.flash('error', error.message);  
                    res.redirect('back');
                }   else {
                    foundTeacher.hasAccount = true;
                    foundTeacher.save();
                    passport.authenticate('locals')(req, res, function() {
                    req.flash('success', 'Task Done Successfully..!');
                    res.redirect('back');
                   });
                }
            });
        }
    });
    
}
// @Login user based on their roles
module.exports.login    = (req, res, next) => {
  var username = req.body.username; 
  User.findOne({username: username, isActive:true }, function(err, foundUser) {
      if(!foundUser || err) {                 
          req.flash("error", "Password or username is incorrect");
          res.redirect('/index/login');                   
      } else {
          if(foundUser.role == 'admin') {
            passport.authenticate('local', {
                successRedirect: '/dashboard/admin',
                successFlash: "Successfully Logged In..!!",
                failureRedirect: '/index/login', 
                failureFlash: true       
            })(req, res, next);
          } else if (foundUser.role == 'student') {
            passport.authenticate('local', {
                successRedirect: '/dashboard/student',
                successFlash: "Successfully Logged In..!!",
                failureRedirect: '/index/login',  
                failureFlash: true       
            })(req, res, next);
          } else {
            passport.authenticate('local', {
                successRedirect: '/dashboard/teacher',
                successFlash: "Successfully Logged In..!!",
                failureRedirect: '/index/login',        
                failureFlash: true 
            })(req, res, next);
          }
      }
  });  

}

// @logout user request
module.exports.logout       = (req, res, next) => {
    req.logout();
    req.flash('success', 'Successfully Logged Out..!');
    res.redirect('/index');

}

// @Change Password By User Itself
module.exports.changePassword = (req, res) => {

    User.findOne({ _id: req.user._id },(err, foundUser) => {
      // Check if error connecting
      if (err) {
        req.flash('error', 'Something Went Wrong..!');
        res.redirect('back');
      } else {
        // Check if user was found in database
        if (!foundUser) {
          req.flash('error', 'User Not Found..!');
          res.redirect('back');
        } else {
          foundUser.changePassword(req.body.oldpassword, req.body.newpassword, function(err) {
             if(err) {
                      if(err.name === 'IncorrectPasswordError'){
                           req.flash('error', 'Incorrect Password..!');
                           res.redirect('back');
                      }else {
                          req.flash('error', 'Something Went Wrong..! Please try again after sometimes.');
                          res.redirect('back');
                      }
            } else {
                          req.flash('success', 'Your password has been changed successfully');
                          res.redirect('back');
             }
           });
        }
      }
    });   
};

// @Change Password of any user by admin
module.exports.setPassword  = (req, res) => {

    User.findOne({ _id: req.params.id },(err, foundUser) => {
        // Check if error connecting
        if (err) {
          req.flash('error', 'Something Went Wrong..!');
          res.redirect('back');
        } else {
          // Check if user was found in database
          if (!foundUser) {
            req.flash('error', 'User Not Found..!');
            res.redirect('back');
          } else {
            foundUser.setPassword(req.body.newpassword, function(err, user){
                if (err) {
                    req.flash('error', 'Something Went Wrong..!Password could not be saved. Please try again!');
                    res.redirect('back');
                } else { 
                  user.save();
                  req.flash('success', 'Password has been changed successfully');
                  res.redirect('back');
                }
            });
          }
        }
      });  
}

// @Activate Deactivate any user Account
module.exports.enableDisableAccount     = (req, res) => {
    let userId = req.params.id;
    User.findById(userId, function(err,foundUser) {
        if (!foundUser || err) {
            req.flash('error', 'Something Went Wrong..!');            
            res.redirect('back');
        }   else {            
            if(foundUser.isActive == false) foundUser.isActive = true;
            else foundUser.isActive = false;

            foundUser.save();
            req.flash('success', 'Task Done Successfully..!');
            res.redirect('back');            
        }
    }) 
}


// @Delete User Account Permanently [ by admin ]
module.exports.deleteAccount  = (req, res) => {
    
    if(req.body.role == 'admin') {
        User.findOneAndRemove({ _id: req.params.id, role: 'admin' }, function(err) {
            if(err) {
                req.flash('error', 'Something Went Wrong..!');
                res.redirect('back'); 
            }   else {
                req.flash('success', 'Successfully Deleted');
                res.redirect('back');
            }
        });
    }
    if(req.body.role == 'student') {
        User.findOne({ _id: req.params.id, role: 'student' }).populate('studentId').exec(function(err, foundUser) {
            if(!foundUser || err) {
                req.flash('error', 'Something Went Wrong..!');
                res.redirect('back');
            } else {
                if(!foundUser.studentId) {
                    foundUser.remove();
                    req.flash('success', 'Successfully Deleted');
                    res.redirect('back');
                } else {
                    foundUser.studentId.hasAccount = false;     // Assigning hasAccount property of student to false before deleting account
                    foundUser.studentId.save();
                    foundUser.remove();
                    req.flash('success', 'Successfully Deleted');
                    res.redirect('back');
                }
            }
        });
    }
    // if role is teacher then
    if(req.body.role == 'teacher') {
        User.findOne({ _id: req.params.id, role: 'student' }).populate('teacherId').exec(function(err, foundUser) {
            if(!foundUser || err) {
                req.flash('error', 'Something Went Wrong..!');
                res.redirect('back');
            } else {
                if(!foundUser.teacherId) {
                    foundUser.remove();
                    req.flash('success', 'Successfully Deleted');
                    res.redirect('back');
                } else {
                    foundUser.teacherId.hasAccount = false;     // Assigning hasAccount property of teacher to false before deleting account
                    foundUser.teacherId.save();
                    foundUser.remove();
                    req.flash('success', 'Successfully Deleted');
                    res.redirect('back');
                }
            }
        });
    }
}