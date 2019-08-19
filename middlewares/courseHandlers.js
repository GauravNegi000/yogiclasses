var Course      = require('../models/course');
var Student     = require('../models/student');

const checkCourseAllowed = function(req, res, next) {
    req.isAllowed = false;
    var value = false;
    if(req.isAuthenticated()) {
            if(req.user.role == 'student') {
                Course.findOne({ slug: req.params.slug }, function(err, foundCourse) {
                    if( !foundCourse || err) {                        
                        res.redirect('*');                        
                    }   else {
                        foundCourse.studentsEnrolled.forEach(function(student){
                            if(student.equals(req.user.studentId)) value = true;
                        })
                        if(value) { req.isAllowed = true ; return next();  }

                        else return next();

                    }
                })
        } else   {
            if(req.user.role == 'admin') { req.isAllowed = true ; return next();  }
            
            else    return next();
         } 
    } else {
         return next();
    }
}



module.exports = {
    checkCourseAllowed,
}