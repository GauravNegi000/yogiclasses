var mongoose        = require('mongoose');
var Contact         = require('../models/contact');
var Registration    = require('../models/registration');
var Tregistration   = require('../models/tregistration');
var Course          = require('../models/course');


                                // Basic Client side controllers

// @get index page 
module.exports.getIndex = function(req, res) {
    var courses  = 'none';
    Course.find({ isActive : true }, function(err, allCourses) {
        if(err) { 
            console.log(Failed);                     
            courses = 'none';
            res.render('client/index', { page: 'index', courses: courses});
        }   else {                     
                if(allCourses.length >= 2) {    // selecting 2 courses based on no. of students enrolled
                    let sortedCourses  = allCourses.sort((a, b) => a.studentsEnrolled.length - b.studentsEnrolled.length);
                    let popularCourses = [ sortedCourses[0], sortedCourses[1] ]   ;     
                    courses = popularCourses;
                    res.render('client/index', { page: 'index', courses: courses});
                }   else {
                    courses = 'none';
                    res.render('client/index', { page: 'index', courses: courses});
                }                
        }
    })
}

// @get login page
module.exports.getLogin = function(req, res) {
    res.render('client/login', { page: 'login' });
}

// Client side Student Registration controller

// @get Student registration form
module.exports.getRegistrationForm = function(req, res) {
    res.render('client/sregistration', { page: 'sregistration' });
}

//  @post Student Registration
module.exports.postRegistration = function(req, res) {
    var newRegistration = {
        name: req.body.name,
        motherName: req.body.mother,
        fatherName: req.body.father,
        pAddress: req.body.paddress,
        cAddress: req.body.caddress,
        mobile: req.body.mobile,
        emailId: req.body.email,
        dob: req.body.dob,
        college: req.body.college,
        percentage: req.body.percentage,
        fatherOccupation: req.body.foccupation,
        motherOccupation: req.body.moccupation,
        annualIncome: req.body.income,
        subjects: req.body.subjects,
        isActive: 0
    }
    Registration.create(newRegistration, function(err, newlyCreated) {
        if (err) {
            req.flash('error', "Something Went Wrong..Plz Try Again ..!");
            res.redirect('back');
        }   else {
            req.flash('success', "Successfully Registration submitted..!");
            res.redirect('back');
        }
    })   
}
// Client side Teacher Registration controller

// @get Teacher registration form
module.exports.getTRegistrationForm = function(req, res) {
    res.render('client/tregistration', { page: 'tregistration' });
}

// @post Teacher Registration
module.exports.postTRegistration = function(req, res) {
    var newRegistration = {
        name: req.body.name,
        motherName: req.body.mother,
        fatherName: req.body.father,
        pAddress: req.body.paddress,
        cAddress: req.body.caddress,
        mobile: req.body.mobile,
        emailId: req.body.email,
        dob: req.body.dob,
        college: req.body.college,
        videourl: req.body.videourl,
        academic: req.body.academic,
        subjects: req.body.subjects,
        isActive: 0
    }
    Tregistration.create(newRegistration, function(err, newlyCreated) {
        if (err) {
            req.flash('error', "Something Went Wrong..Plz Try Again ..!");
            res.redirect('back');
        }   else {
            req.flash('success', "Successfully Registration Form submitted..!");
            res.redirect('back');
        }
    })   
}

// Contact page(enquiry) controller

// @post enquiry/contact form
module.exports.postContact = function(req, res) {
    var newContact  =  { 
        name:    req.body.name, 
        email:   req.body.email, 
        mobile:  req.body.mobile, 
        subject: req.body.subject, 
        message: req.body.message 
    };
    Contact.create(newContact,function(err, newlyCreated){
        if(err) { 
            res.redirect('/index'); 
            console.log(err);
        }   else { 
            req.flash('success', "Successfully Enquiry submitted..!");
            res.redirect('/index');          
        }    
    });
}

// @get pricing page
module.exports.getPricing = function(req, res) {
    res.render('client/pricing', { page: 'pricing' });
}
