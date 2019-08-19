var mongoose        = require('mongoose');
var Course          = require('../models/course');

// User-End Course Controllers //

// @get list of all the courses
module.exports.getCourseList   = (req, res) => {
    var perPage = 6;
    var page = req.params.page || 1

    if(page > 0 && !isNaN(page)) {
    Course.find({ isActive: true })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, allCourses) {
        Course.countDocuments({ isActive: true }).exec((err, count) => {
            if(err) {
                req.flash('error', 'Something Went Wrong..!');
                res.redirect('/dashboard/admin');
            }   else {
                res.render('client/courses', { 
                    courses: allCourses, page: 'courses' ,
                    current: page,
                    pages: Math.ceil(count / perPage)
                });
            }
        })
        
    })
}   else {
    req.flash('error', 'Something Went Wrong..!');
    res.redirect('*');
} 
};

// @get details of particular course
module.exports.getCourse = (req, res) => {

    var isAllowed   = req.isAllowed; // variable to check that user is authorized or not
    Course.findOne({ slug: req.params.slug, isActive:true }, function(err, foundCourse) {
        if( !foundCourse || err) {
            req.flash('error', 'Something Went Wrong..!');            
            res.redirect('*');
        }   else {                
                res.render('client/course-details',{ course: foundCourse, page: 'courseDetails', isAllowed: isAllowed});                        

        }
    })

};

// @get video of particular subtopic
module.exports.getCourseVideo = (req, res) => {
    let topicId    = req.params.topicId;
    let subTopicId = req.params.subTopicId;
    var value1 = 0;
    var value2 = 0;
    var isAllowed   = req.isAllowed; // variable to check that user is authorized or not
    Course.findOne({ slug: req.params.slug, isActive:true  }, function(err, foundCourse) {
        if(!foundCourse || err || !isAllowed) {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('*');
        }   else {    
            var value2  = foundCourse.outline.length;        
            foundCourse.outline.forEach((topic) => {
                if (topic._id == topicId) {
                    value3  = topic.subTopic.length;
                    topic.subTopic.forEach((subtopic) => {
                        if (subtopic._id == subTopicId) value1 = subtopic; 
                        else { value3--; }
                    });
                } else { value2--; }
            });  
            if(value2 == 0) {  req.flash('error', 'Something Went Wrong..!');  res.redirect('*'); }
            else {
                if(value1 != 0) return  res.render('client/course-video',{ subtopic: value1, isAllowed: isAllowed });

                else {  req.flash('error', 'Something Went Wrong..!');  res.redirect('*'); }
            }        
        }
    })
};

// Admin-End Course Controller //

// @get all courses to admin
module.exports.getCoursesAdmin   = (req, res) => {
    Course.find({}, function(err, allCourses) {
        if(err) {            
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('/dashboard/admin');
        }   else {
            res.render('dashboard/course', { courses: allCourses, active: 'courses' });
        }
    })
}

// @add new course
module.exports.addCourse   = (req, res) => {
    var newCourse = {
        title: req.body.title,        
    } 
    Course.create(newCourse, function(err, course) {
        if (err) {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('back');           
        }   else {
            course.isActive = false;
            course.save();
            req.flash('success', 'Task Done Successfully..!');
            res.redirect('back');
        }
    }); 
};

// Enable or Disable Course
module.exports.enableDisableCourse     = (req, res) => {
    let courseId = req.params.id;
    Course.findById(courseId, function(err,foundCourse) {
        if (!foundCourse || err) {
            req.flash('error', 'Something Went Wrong..!');            
            res.redirect('back');
        }   else {            
            if(foundCourse.isActive == false) foundCourse.isActive = true;
            else foundCourse.isActive = false;

            foundCourse.save();
            req.flash('success', 'Task Done Successfully..!');
            res.redirect('back');            
        }
    }) 
}

// @delete particular course
module.exports.deleteCourse   = (req, res)  => {
    let courseId = req.params.id;
    Course.findById(courseId).populate({ path: 'studentsEnrolled', populate: { path: 'studentsEnrolled'}})
    .exec(function(err, foundCourse) {
        if (err) {           
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('back');
        }   else {
            foundCourse.studentsEnrolled.forEach((student) => {
                student.courseAllot.forEach((course) => {
                    if(course == courseId) student.courseAllot.pop(course);
                });
                student.save();
            });
            foundCourse.remove();
            req.flash('success', 'Task Done Successfully..!');
            res.redirect('back');
        }
    })    
}

// @edit course page
module.exports.editCourse   = (req, res) => {
    let courseId = req.params.id;
    Course.findById(courseId, function(err,foundCourse) {
        if (!foundCourse || err) {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('*');
        }   else {                       
            res.render('dashboard/editcourse', { course: foundCourse, active: 'courses' });
        }
    }) 
}

// @update course request
module.exports.updateCourse   = (req, res) => {
    let courseId = req.params.id;   
    Course.findById(courseId, function(err,foundCourse) {
        if (!foundCourse || err) {
            req.flash('error', 'Something Went Wrong..!'); 
            res.redirect('back');
        }   else {            
            foundCourse.title       = req.body.title,
            foundCourse.description = req.body.description,
            foundCourse.description2= req.body.description2,
            foundCourse.trainer     =  req.body.trainer,
            foundCourse.courseFee   =  req.body.fee
            foundCourse.category    =  req.body.category
            foundCourse.save();
            req.flash('success', 'Task Done Successfully..!');
            res.redirect('back');
        }
    }) 
}

// @add image in the course
module.exports.addCourseImage   = (req, res) => {
    if( !req.fileValidationError ) {
        var imageFileName   = req.file.filename;
        var imageFileID     = req.file.id;
        Course.findById(req.params.id, function(err, foundCourse) {
            if (!foundCourse || err) {
                req.flash('error', 'Something Went Wrong..!');
                res.redirect('back');           
            }   else {
                foundCourse.image.fileName = imageFileName;
                foundCourse.image.fileId = imageFileID;
                foundCourse.save();
                req.flash('success', 'Task Done Successfully..!');
                res.redirect('back');
            }
        });
    } else {
       
            req.flash('error', 'File Type Error..!');
            res.redirect('back');     
    }
}

// @add topic in the particular course
module.exports.addTopic    = (req, res) => {
    var newTopic = { topic: req.body.newtopic }
    Course.findById(req.params.id, function(err, foundCourse) {
        if (!foundCourse || err) {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('back');           
        }   else {
            foundCourse.outline.push(newTopic);
            foundCourse.save();
            req.flash('success', 'Task Done Successfully..!');
            res.redirect('back');
        }
    });
};

// @delete topic
module.exports.deleteTopic  = (req, res) => {
    let courseId = req.params.id;
    let topicId  = req.params.topic_id;

    Course.findById(courseId, function(err, foundCourse) {
        if(!foundCourse || err) {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('back');
        }   else {
            foundCourse.outline.forEach((topic) => {
                if (topic._id == topicId) foundCourse.outline.pop(topic);
            });
            foundCourse.save();
            req.flash('success', 'Task Done Successfully..!');
            res.redirect('back');
        }
    });
};

// @add subtopic to particular topic
module.exports.addSubTopic  = (req, res) => {
    var newSubTopic  = {name: req.body.subtopic, videoUrl: req.body.video};
    var topicId = req.params.topic_id; 
    Course.findById(req.params.id, function(err, foundCourse) {
        if(!foundCourse || err) {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('back');
        }   else {
            foundCourse.outline.forEach((topic) => {
                if (topic._id == topicId ) topic.subTopic.push(newSubTopic);               
            });
            foundCourse.save();
            req.flash('success', 'Task Done Successfully..!');
            res.redirect('back');
        }
    });
};

// @delete subtopic
module.exports.deleteSubTopic   = (req, res) => {
    let courseId   = req.params.id;
    let topicId    = req.params.topic_id;
    let subTopicId = req.params.subtopic_id;
    Course.findById(courseId, function(err, foundCourse) {
        if (!foundCourse || err) {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('back');
        }   else {
            foundCourse.outline.forEach((topic) => {
                if (topic._id == topicId) {
                    topic.subTopic.forEach((subtopic) => {
                        if (subtopic._id == subTopicId) topic.subTopic.pop(subtopic);
                    });
                } 
            });
            foundCourse.save();
            req.flash('success', 'Task Done Successfully..!');
            res.redirect('back');
        }
    });

};
