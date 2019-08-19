var mongoose        = require('mongoose');
var Contact         = require('../models/contact');
var Registration    = require('../models/registration');
var Student         = require('../models/student');
var Tregistration   = require('../models/tregistration');
var Teacher         = require('../models/teacher');
var Course          = require('../models/course')
var Thought         = require('../models/thought');
var User            = require('../models/user');
var Transaction     = require('../models/transaction');

// @get admin dashboard
module.exports.getDashboard     = (req, res) => {
   Thought.find({},function(err, allThoughts) { // getting thoughts posted
       if(err) res.redirect('back');

       else {
           Student.count({isActive: true},function(err,scount ){
               if(err) res.redirect('back');
                else {
                    Teacher.countDocuments({isActive: true}, function(err, tcount){
                       if(err) res.redirect('back');
                        else {
                            Course.countDocuments({isActive: true}, function(err, ccount){
                                if(err) res.redirect('back');

                                else    res.render('dashboard/index', { active:'dashboard',thoughts: allThoughts, scount: scount, tcount: tcount,ccount: ccount });

                            })
                        }
                    })
                }               
           })
       }
    })
};

// Enquiry Controllers //

// @get enquiry page
module.exports.getEnquiry     = (req, res) => {
    var perPage = 10
    var page = req.params.page || 1
    if(page > 0 && !isNaN(page)) {     
    Contact.find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, allEnquiry) {
        Contact.countDocuments().exec(function(err, count) {
            if(err) {
                req.flash("error", "Something Went Wrong..!");
                res.redirect('back');
            }   else {
                res.render('dashboard/enquiry',{
                    enquiries: allEnquiry, active:'enquiry',
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

// @get enquiry details in particular
module.exports.getEnquiryDetails     = (req, res) => {
    Contact.findById(req.params.id, function(err, foundenquiry) {
        if(err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');
        }  else {
            res.render('dashboard/enquirydetails', {enquiry: foundenquiry, active:'enquiry'});
        } 
    })
};

// @delete enquiry
module.exports.deleteEnquiry        = (req, res) => {
    Contact.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');
        }   else {
            req.flash("success", "Task Done Successfully..!");
            res.redirect('back');
        }
    })
}

//Student & Teacher Registration Controllers //

// @get registrations of both student and teacher
module.exports.getRegistration     = (req, res) => {
    Registration.find({}, function(err, allRegistrations) {     // allRegistrations are student registrations
        if (err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');
        }   else {
            Tregistration.find({}, function(error, allTregistrations){      // allTregistrations are teacher registrations
                if (err) {
                    req.flash("error", "Something Went Wrong..!");
                    res.redirect('back');    
                }   else {
                        res.render('dashboard/registration', { registrations: allRegistrations, tregistrations: allTregistrations, active:'registration' });
                }
            })
        }
    });
};
                // @Student Registration
// @get student registration details                
module.exports.getRegistrationDetails     = (req, res) => {
    Registration.findById(req.params.id, function(err, foundRegistration) {
        if (err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');
        }   else {
            res.render('dashboard/registrationdetails', {registration: foundRegistration, active:'registration'});
        }
    });
};

// @delete student registration 
module.exports.deleteRegistration       = (req, res) => {
    Registration.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');
        }   else {
            req.flash("success", "Task Done Successfully..!");
            res.redirect('back');
        }
    });
};
            // Teacher Registration
// @get teacher registration details            
module.exports.getTRegistrationDetails     = (req, res) => {
    Tregistration.findById(req.params.id, function(err, foundRegistration) {
        if (err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');
        }   else {
            res.render('dashboard/tregistrationdetails', {tregistration: foundRegistration, active:'registration'});
        }
    });
};

// @delete teacher registration
module.exports.deleteTRegistration       = (req, res) => {
    Tregistration.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');
        }   else {
            req.flash("success", "Task Done Successfully..!");
            res.redirect('back');
        }
    });
};

// Student Controllers //

// @create Student from registration
module.exports.postCreateStudent = (req, res) => {
    Registration.findById(req.params.id,function(err, foundRegistration) {
        if(err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');
        } else {
            var newStudent = {
                name: foundRegistration.name.trim().toUpperCase(),
                motherName: foundRegistration.motherName.trim().toUpperCase(),
                fatherName: foundRegistration.fatherName.trim().toUpperCase(),
                pAddress: foundRegistration.pAddress,
                cAddress: foundRegistration.cAddress,
                mobile: foundRegistration.mobile,
                emailId: foundRegistration.emailId.trim().toLowerCase(),
                dob: foundRegistration.dob,
                college: foundRegistration.college,
                percentage: foundRegistration.percentage,
                fatherOccupation: foundRegistration.fatherOccupation,
                motherOccupation: foundRegistration.motherOccupation,
                annualIncome: foundRegistration.annualIncome,
                subjects: foundRegistration.subjects,
                isActive: true,
                hasAccount: false
            }
            Student.create(newStudent, function(err,newlycreated) {
                if (err) {
                    req.flash("error", "Something Went Wrong..!");
                    res.redirect('back');
                }   else {
                    foundRegistration.isActive = true;
                    foundRegistration.save();
                    req.flash("success", "Task Done Successfully..!");
                    res.redirect('back');
                }
            });
        }
    });
}

// @get list of all students 
module.exports.getStudentList   = (req, res) => {
    var perPage = 10
    var page = req.params.page || 1

    if(req.query.search) {      // search query check
        if(page > 0 && !isNaN(page)) {     
        Student.find({ name: req.query.search.toUpperCase() })        
        .exec(function(err, allStudents) {
            Student.countDocuments().exec(function(err, count) {
                if (err) {
                    req.flash("error", "Something Went Wrong..!");
                    res.redirect('back');
                }   else {
                    res.render('dashboard/students', { 
                        students: allStudents, active:'students' ,
                        current: page,
                        pages: Math.ceil(count / perPage) 
                    });
                }
            })
        
        });
    }   else {
        req.flash('error', 'Something Went Wrong..!');
        res.redirect('*');
    }
}   else {
        if(page > 0 && !isNaN(page)) {     
            Student.find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function(err, allStudents) {
                Student.countDocuments().exec(function(err, count) {
                    if (err) {
                        req.flash("error", "Something Went Wrong..!");
                        res.redirect('back');
                    }   else {
                        res.render('dashboard/students', { 
                            students: allStudents, active:'students' ,
                            current: page,
                            pages: Math.ceil(count / perPage) 
                        });
                    }
                })
            
            });
        }   else {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('*');
        }
}
}

// @get details of particular student
module.exports.getStudentDetails     = (req, res) => {
    Student.findById(req.params.id).populate('teacherAllot').populate({ path: 'courseAllot', populate: { path: 'courseAllot'}})
    .exec(function(err, foundStudent) {
        if (err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');
        }   else {
            res.render('dashboard/studentdetails', {student: foundStudent, active:'students'});
        }
    });
};

// @delete student [ isActive == false ]
module.exports.deleteStudent         = (req, res) => {
    Student.findById(req.params.id, function(err, foundStudent) {
        if (err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');
        }   else {
            foundStudent.isActive = false;
            foundStudent.save();
            req.flash("success", "Task Done Successfully..!");
            res.redirect('back');
        }
    })
}

// @edit students page
module.exports.editStudent          = (req, res) => {
    Student.findById(req.params.id).populate({ path: 'courseAllot', populate: { path: 'courseAllot'}}) // populating courseAllot field
    .exec(function(err, foundStudent) {
        if(err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');   
        }   else {
            Teacher.find({}, function(err, allTeachers) {
                if(err) {
                    req.flash("error", "Something Went Wrong..!");
                    res.redirect('back');
                }   else {
                    Course.find({}, function(err, allCourses) {
                        if(err) {
                            req.flash("error", "Something Went Wrong..!");
                            res.redirect('back');
                        }   else {
                            res.render('dashboard/editstudent', { student: foundStudent, teachers: allTeachers, courses: allCourses, active:'students' });
                        } 
                    })
                }
            })
        }
    })
}

// @update student request [ alloting teacher and subject to student ]
module.exports.updateStudent        = (req, res) => {
    let alreadyStudent = false;

    Student.findById(req.params.id, function(err, foundStudent) {
        if (err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');
        }   else {
            Teacher.findById(req.body.teacherId, function(err, foundTeacher) {
                if(err) {
                    req.flash("error", "Something Went Wrong..!");
                    res.redirect('back');   
                }   else {
                        foundTeacher.studentAlloted.forEach((student) => {
                            if(student.equals(foundStudent._id)) alreadyStudent = true;
                        });

                        if(!alreadyStudent) {
                            foundTeacher.studentAlloted.push(foundStudent._id);
                            foundTeacher.save();
                        }
                        foundStudent.subjectAllot = req.body.allotedsubject;
                        foundStudent.teacherAllot = req.body.teacherId;
                        foundStudent.save();
                        req.flash("success", "Task Done Successfully..!");
                        res.redirect('back');
                }
            });
        }
    });
}

// @remove teacher from student
module.exports.removeTeacher        = (req, res) => {
    Student.findById(req.params.id, function(err, foundStudent) {
        if (err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');
        }   else {
            if(foundStudent.teacherAllot) {
                Teacher.findById(foundStudent.teacherAllot, function(err, foundTeacher) {
                    if(!foundTeacher || err) {                      
                        req.flash("error", "Something Went Wrong here..!");
                        res.redirect('back'); 
                    }   else {
                        foundTeacher.studentAlloted.forEach((student) => {
                            if(student.equals(foundStudent._id)) foundTeacher.studentAlloted.pop(student);
                        });
                        foundTeacher.save();
                        foundStudent.subjectAllot = null;
                        foundStudent.teacherAllot = null;
                        foundStudent.save();
                        req.flash("success", "Task Done Successfully..!");
                        res.redirect('back');
                    }
                })
            } else {
                req.flash("error", "Already Empty..!");
                res.redirect('back'); 
            }
        }
    })
}

// @allot course to student request
module.exports.allotCourse        = (req, res) => {
    let alreadyEnrolled = false;    // variable to check whether the student is already enrolled or not
    Student.findById(req.params.id, function(err, foundStudent) {
        if (err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');
        }   else {
            Course.findById(req.body.courseId, function(err, foundCourse) {
                if(err) {
                    req.flash("error", "Something Went Wrong..!");
                    res.redirect('back');
                }   else {
                    foundCourse.studentsEnrolled.forEach((student) => {
                        if(student.equals(foundStudent._id)) alreadyEnrolled = true;
                    });
                    if(alreadyEnrolled) {
                        req.flash("error", "Student Already Enrolled..!");
                        res.redirect('back'); 
                    } else {
                        var student = foundStudent._id
                        var course =  foundCourse._id;
                        foundCourse.studentsEnrolled.push(student);
                        foundCourse.save();
                        foundStudent.courseAllot.push(course);
                        foundStudent.save();
                        req.flash("success", "Task Done Successfully..!");
                        res.redirect('back');
                    }

                }
            });                    
        }
    });
}

// @remove particular course from the student and also remove student from that particular course
module.exports.removeCourse  = (req, res) => {
    let studentId = req.params.id;
    let courseId  = req.params.courseid;

    Student.findById(studentId, function(err, foundStudent) {
        if(!foundStudent || err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');
        }   else {
            Course.findOne({ _id: courseId }, function(err, foundCourse) {
                if(err) {
                    req.flash("error", "Something Went Wrong..!");
                    res.redirect('back'); 
                } else {
                    if(!foundCourse) {
                        foundStudent.courseAllot.forEach((course) => {
                            if(course == courseId) foundStudent.courseAllot.pop(course);
                        });
                        foundStudent.save();
                        req.flash("success", "Task Done Successfully..!");
                        res.redirect('back');
                    } else {
                        foundStudent.courseAllot.forEach((course) => {
                            if(course == courseId) foundStudent.courseAllot.pop(course);    // removing course from student
                        });
                        foundStudent.save();
                        foundCourse.studentsEnrolled.forEach((student) => {
                            if(student.equals(foundStudent._id)) foundCourse.studentsEnrolled.pop(student); // removing student from course
                        });
                        foundCourse.save();
                        req.flash("success", "Task Done Successfully..!");
                        res.redirect('back'); 
                    }
                }
            })
        }
    });
}

// @save transaction details in student and in transaction model also
module.exports.saveStudentTransaction  = (req, res)  => {
    let studentId = req.params.id;
    Student.findById(studentId, function(err, foundStudent) {
        if(!foundStudent || err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');  
        }   else {
            var newTransactionStudent = {
                subject: req.body.subject,
                month:   req.body.month,
                amount:  req.body.amount,
                paid:    req.body.paid,
                pmode:   req.body.paymentmode,
                pdetails:req.body.paymentdetails,
            }
            var newTransaction = {
                name:    foundStudent.name,
                role:    'student',
                amount:  req.body.amount,
                paid:    req.body.paid,
                pmode:   req.body.paymentmode,
            }
            Transaction.create(newTransaction, function(err, newlycreated) {
                if(err) {
                    req.flash("error", "Something Went Wrong..!");
                    res.redirect('back');  
                }   else {
                    foundStudent.transactions.push(newTransactionStudent);
                    foundStudent.save();
                    req.flash("success", "Task Done Successfully..!");
                    res.redirect('back');
                }
            })
        }
    })
}

// @delete Transaction detail from student
module.exports.deleteStudentTransaction = (req, res) => {
    let studentId = req.params.id;
    let transactionId = req.params.transId;

    Student.findById(studentId, function(err, foundStudent) {
        if(!foundStudent || err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back'); 
        }   else {
            foundStudent.transactions.forEach((transaction) => {
                if(transaction._id == transactionId) foundStudent.transactions.pop(transaction);
            });
            foundStudent.save();
            req.flash("success", "Task Done Successfully..!");
            res.redirect('back');
        }
    })
}


//Teacher Controllers

// @create teacher from teacher registration
module.exports.postCreateTeacher = (req, res) => {
    Tregistration.findById(req.params.id,function(err, foundRegistration) {
        if(err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');
        } else {
            var newTeacher = {
                name: foundRegistration.name.trim().toUpperCase(),
                motherName: foundRegistration.motherName.trim().toUpperCase(),
                fatherName: foundRegistration.fatherName.trim().toUpperCase(),
                pAddress: foundRegistration.pAddress,
                cAddress: foundRegistration.cAddress,
                mobile: foundRegistration.mobile,
                emailId: foundRegistration.emailId.trim().toLowerCase(),
                dob: foundRegistration.dob,
                college: foundRegistration.college,
                videourl: foundRegistration.videourl,
                academic: foundRegistration.academic,
                subjects: foundRegistration.subjects,
                isActive: true,
                hasAccount: false
            }
            Teacher.create(newTeacher, function(err,newlycreated) {
                if (err) {
                    req.flash("error", "Something Went Wrong..!");
                    res.redirect('back');
                }   else {
                    foundRegistration.isActive = true;
                    foundRegistration.save();
                    req.flash("success", "Task Done Successfully..!");
                    res.redirect('back');
                }
            });
        }
    });
}

// @get list of all teachers
module.exports.getTeacherList   = (req, res) => {
    var perPage = 10
    var page = req.params.page || 1

    if(req.query.search) {      // search query check
        if(page > 0 && !isNaN(page)) { 
        Teacher.find({ name: req.query.search.toUpperCase() })        
        .exec(function(err, allTeachers) {
            Teacher.countDocuments().exec(function(err, count) {
                if (err) {
                    req.flash("error", "Something Went Wrong..!");
                    res.redirect('back');
                }   else {
                    res.render('dashboard/teachers', { 
                        teachers: allTeachers, active:'teachers',
                        current: page,
                        pages: Math.ceil(count / perPage) 
                    });
                }
            })
            
        });
    }   else {
        req.flash('error', 'Something Went Wrong..!');
        res.redirect('*');
    }
}   else {
    if(page > 0 && !isNaN(page)) { 
        Teacher.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, allTeachers) {
            Teacher.countDocuments().exec(function(err, count) {
                if (err) {
                    req.flash("error", "Something Went Wrong..!");
                    res.redirect('back');
                }   else {
                    res.render('dashboard/teachers', { 
                        teachers: allTeachers, active:'teachers',
                        current: page,
                        pages: Math.ceil(count / perPage) 
                    });
                }
            })
            
        });
    }   else {
        req.flash('error', 'Something Went Wrong..!');
        res.redirect('*');
    }
}
}

// @get details of particular teacher
module.exports.getTeacherDetails     = (req, res) => {
       
    Teacher.findById(req.params.id, function(err, foundTeacher) {
        if (err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');
        }   else {
            res.render('dashboard/teacherdetails', {teacher: foundTeacher, active:'teachers'});
        }
    });

};

// @delete teacher [ isActive == false ]
module.exports.deleteTeacher         = (req, res) => {
    Teacher.findById(req.params.id, function(err, foundTeacher) {
        if (err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');
        }   else {
            foundTeacher.isActive = false;
            foundTeacher.save();
            req.flash("success", "Task Done Successfully..!");
            res.redirect('back');
        }
    })
}

// @edit Teacher Page
module.exports.editTeacher  = (req, res) => {
    let teacherId = req.params.id;
    Teacher.findById(teacherId, function(err, foundTeacher) {
        if(!foundTeacher || err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');  
        }   else {
            res.render('dashboard/editteacher', { teacher: foundTeacher, active: 'teachers' });
        }
    })
}

// @save transaction details in teacher and in transaction model also
module.exports.saveTeacherTransaction  = (req, res)  => {
    let teacherId = req.params.id;
    Teacher.findById(teacherId, function(err, foundTeacher) {
        if(!foundTeacher || err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back');  
        }   else {
            var newTransactionTeacher = {
                subject: req.body.subject,
                month:   req.body.month,
                amount:  req.body.amount,
                paid:    req.body.paid,
                pmode:   req.body.paymentmode,
                pdetails:req.body.paymentdetails,
            }
            var newTransaction = {
                name:    foundTeacher.name,
                role:    'teacher',
                amount:  req.body.amount,
                paid:    req.body.paid,
                pmode:   req.body.paymentmode,
            }
            Transaction.create(newTransaction, function(err, newlycreated) {
                if(err) {
                    req.flash("error", "Something Went Wrong..!");
                    res.redirect('back');  
                }   else {
                    foundTeacher.transactions.push(newTransactionTeacher);
                    foundTeacher.save();
                    req.flash("success", "Task Done Successfully..!");
                    res.redirect('back');
                }
            })
        }
    })
}

// @delete Transaction detail from student
module.exports.deleteTeacherTransaction = (req, res) => {
    let teacherId = req.params.id;
    let transactionId = req.params.transId;

    Teacher.findById(teacherId, function(err, foundTeacher) {
        if(!foundTeacher || err) {
            req.flash("error", "Something Went Wrong..!");
            res.redirect('back'); 
        }   else {
            foundTeacher.transactions.forEach((transaction) => {
                if(transaction._id == transactionId) foundTeacher.transactions.pop(transaction);
            });
            foundTeacher.save();
            req.flash("success", "Task Done Successfully..!");
            res.redirect('back');
        }
    })
}


// Profile Controllers

// @get profile for admin
module.exports.getProfile  = (req, res) =>{
    res.render('dashboard/profile',{ active:'profile' });
}

// @add profile picture to admin user
module.exports.addProfileImage   = (req, res) => {
    if( !req.fileValidationError ) {
        var imageFileName   = req.file.filename;    // storing file info in image fields
        var imageFileID     = req.file.id;
            User.findById(req.user._id, function(err, foundUser) {
                if(!foundUser || err) {
                    req.flash('error', 'Something Went Wrong..!');
                    res.redirect('back');  
                }   else {                       
                        foundUser.image.fileName = imageFileName;
                        foundUser.image.fileId = imageFileID;
                        foundUser.save();
                        req.flash('success', 'Task Done Successfully..!');
                        res.redirect('back');
                }
            })
    } else {   
            req.flash('error', 'File Type Error..!');
            res.redirect('back');     
    }
}

// @get list of all accounts 
module.exports.getAccounts    = (req, res) => {
    var perPage = 10
    var page = req.params.page || 1

    if(req.query.search) {      // search query check
        if(page > 0 && !isNaN(page)) {
        User.find({ name: req.query.search.toUpperCase() })        
        .exec(function(err, allUsers) {
            User.countDocuments().exec(function(err, count) {
                if(err) {
                    req.flash('error', 'Something Went Wrong..!');
                    res.redirect('back');
                }   else {
                    res.render('dashboard/accounts', { 
                        active: 'accounts', users: allUsers,
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
}   else {
        if(page > 0 && !isNaN(page)) {
            User.find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function(err, allUsers) {
                User.countDocuments().exec(function(err, count) {
                    if(err) {
                        req.flash('error', 'Something Went Wrong..!');
                        res.redirect('back');
                    }   else {
                        res.render('dashboard/accounts', { 
                            active: 'accounts', users: allUsers,
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
}
};

// @get transactions [ active ones ]
module.exports.getTransactions     = (req, res) => {
     
    var perPage = 10
    var page = req.params.page || 1
    
    if(req.query.search) {      // search query check
        if(page > 0 && !isNaN(page)) {
        Transaction.find({ isActive: true, name: req.query.search.toUpperCase() })
        .exec(function(err, allTransactions) {
            Transaction.countDocuments({ isActive: true }).exec(function(err, count) {
                if(err) {
                    req.flash('error', 'Something Went Wrong..!');
                    res.redirect('back');   
                }   else {
                    res.render('dashboard/transactions', { 
                        transactions: allTransactions, active:'transactions',
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

} else {
    if(page > 0 && !isNaN(page)) {
        Transaction.find({ isActive: true })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, allTransactions) {
            Transaction.countDocuments({ isActive: true }).exec(function(err, count) {
                if(err) {
                    req.flash('error', 'Something Went Wrong..!');
                    res.redirect('back');   
                }   else {
                    res.render('dashboard/transactions', { 
                        transactions: allTransactions, active:'transactions',
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
}
};

// @delete transaction [ isActive == false ]
module.exports.deleteTransaction    = (req, res) => {
    Transaction.findById(req.params.id, function(err, foundTransaction) {
        if(!foundTransaction || err) {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('back'); 
        }   else {
            foundTransaction.isActive = false;
            foundTransaction.save();
            req.flash('success', 'Task Done Successfully..!');
            res.redirect('back');
        }
    })
}
