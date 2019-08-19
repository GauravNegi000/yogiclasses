var User            = require('../models/user');

const isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
       return next();
    }
    res.redirect("/index/login");
}

const isAdmin = function(req, res, next) {
    if(req.isAuthenticated()) {
        if(req.user.role == 'admin')    return next();
        else {
            res.redirect("/index/login"); 
        }
    } else {
        res.redirect("/index/login");
    }
}

const isStudent = function(req, res, next) {
    if(req.isAuthenticated()) {
        if(req.user.role == 'student')    return next();
        else {
            res.redirect("/index/login"); 
        }
    } else {
        res.redirect("/index/login");
    }
}

const isTeacher = function(req, res, next) {
    if(req.isAuthenticated()) {
        if(req.user.role == 'teacher')    return next();
        else {
            res.redirect("/index/login"); 
        }
    } else {
        res.redirect("/index/login");
    }
}




module.exports = { 
    isLoggedIn,
    isAdmin,
    isStudent,
    isTeacher
}