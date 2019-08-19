var express         = require('express');
var router          = express.Router();
var adminCtrl       = require('../controller/adminController');
var userCtrl        = require('../controller/userController');
var authHandlers    = require('../middlewares/authHandlers');
var courseCtrl      = require('../controller/courseController');
var thoughtCtrl     = require('../controller/thoughtController');
var multer          = require('multer');
var storage         = require('../middlewares/gridStorage').storage;
 
// Image Upload multer Configuration
var fileFilter      = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        req.fileValidationError = false;
        cb(null, true);
    } else {
        req.fileValidationError = true;
        return cb(null, false, new Error('goes wrong on the mimetype'));
    }
}; 
var maxSize = 1024 * 400;

var upload          = multer({
    storage: storage,
    limits:{
        fileSize: maxSize
    },
    fileFilter: fileFilter
}).single('image');

var uploadCallback = (req, res, next) => 
    upload(req, res, function(err) {
        if (err) {
            req.flash('error', err.message );
            return res.redirect('back');
        }   else {
            next();
        }
})
// --

router.get('/'                                                   ,authHandlers.isAdmin ,adminCtrl.getDashboard);

// Enquiry Routes //
router.get('/enquiry/:page'                                      ,authHandlers.isAdmin ,adminCtrl.getEnquiry);

router.get('/enquiry/details/:id'                                ,authHandlers.isAdmin ,adminCtrl.getEnquiryDetails);

router.delete('/enquiry/:id'                                     ,authHandlers.isAdmin ,adminCtrl.deleteEnquiry);

//Student & Teacher Registration Routes //
router.get('/registrations'                                      ,authHandlers.isAdmin ,adminCtrl.getRegistration);

router.get('/registrations/s/details/:id'                        ,authHandlers.isAdmin ,adminCtrl.getRegistrationDetails);

router.delete('/registrations/s/:id'                             ,authHandlers.isAdmin ,adminCtrl.deleteRegistration);

router.post('/registrations/s/:id'                               ,authHandlers.isAdmin ,adminCtrl.postCreateStudent); // Copying student from registration //

router.get('/registrations/t/details/:id'                        ,authHandlers.isAdmin ,adminCtrl.getTRegistrationDetails);

router.delete('/registrations/t/:id'                             ,authHandlers.isAdmin ,adminCtrl.deleteTRegistration);

router.post('/registrations/t/:id'                               ,authHandlers.isAdmin ,adminCtrl.postCreateTeacher); // Copying teacher from registration //

// Student Routes //
router.get('/students/:page'                                     ,authHandlers.isAdmin ,adminCtrl.getStudentList);

router.get('/students/details/:id'                               ,authHandlers.isAdmin ,adminCtrl.getStudentDetails);

router.delete('/students/:id'                                    ,authHandlers.isAdmin ,adminCtrl.deleteStudent);

router.get('/students/:id/edit'                                  ,authHandlers.isAdmin ,adminCtrl.editStudent);

router.put('/students/:id'                                       ,authHandlers.isAdmin ,adminCtrl.updateStudent);

router.put('/students/:id/removeteacher'                         ,authHandlers.isAdmin ,adminCtrl.removeTeacher);

router.post('/students/:id/course'                               ,authHandlers.isAdmin ,adminCtrl.allotCourse);

router.delete('/students/:id/course/:courseid'                   ,authHandlers.isAdmin ,adminCtrl.removeCourse);

router.post('/students/:id/transaction'                          ,authHandlers.isAdmin ,adminCtrl.saveStudentTransaction);

router.delete('/students/:id/transaction/:transId'               ,authHandlers.isAdmin ,adminCtrl.deleteStudentTransaction);

router.post('/students/account/:id'                              ,authHandlers.isAdmin ,userCtrl.signupStudent);

// Teacher Routes // 
router.get('/teachers/:page'                                     ,authHandlers.isAdmin ,adminCtrl.getTeacherList);

router.get('/teachers/details/:id'                               ,authHandlers.isAdmin ,adminCtrl.getTeacherDetails);

router.delete('/teachers/:id'                                    ,authHandlers.isAdmin ,adminCtrl.deleteTeacher);

router.get('/teachers/:id/edit'                                  ,authHandlers.isAdmin ,adminCtrl.editTeacher);

router.post('/teachers/:id/transaction'                          ,authHandlers.isAdmin ,adminCtrl.saveTeacherTransaction);

router.delete('/teachers/:id/transaction/:transId'               ,authHandlers.isAdmin ,adminCtrl.deleteTeacherTransaction);

router.post('/teachers/account/:id'                              ,authHandlers.isAdmin ,userCtrl.signupTeacher);

//Course Routes //
router.get('/courses'                                            ,authHandlers.isAdmin ,courseCtrl.getCoursesAdmin);

router.post('/courses'                                           ,authHandlers.isAdmin ,courseCtrl.addCourse);

router.delete('/courses/:id'                                     ,authHandlers.isAdmin ,courseCtrl.deleteCourse);

router.post('/courses/:id/enabledisable'                         ,authHandlers.isAdmin ,courseCtrl.enableDisableCourse);

router.get('/courses/:id/edit'                                   ,authHandlers.isAdmin ,courseCtrl.editCourse);

router.put('/courses/:id/edit'                                   ,authHandlers.isAdmin ,courseCtrl.updateCourse);

router.put('/courses/:id/upload'                                 ,authHandlers.isAdmin ,uploadCallback ,courseCtrl.addCourseImage);

router.post('/courses/:id/edit/topic'                            ,authHandlers.isAdmin ,courseCtrl.addTopic);

router.delete('/courses/:id/edit/:topic_id'                      ,authHandlers.isAdmin ,courseCtrl.deleteTopic);

router.post('/courses/:id/edit/:topic_id'                        ,authHandlers.isAdmin ,courseCtrl.addSubTopic);

router.delete('/courses/:id/edit/:topic_id/:subtopic_id'         ,authHandlers.isAdmin ,courseCtrl.deleteSubTopic);

// Thoughts Routes //
router.post('/thought'                                           ,authHandlers.isAdmin ,thoughtCtrl.postThought);

router.delete('/thought/:id'                                     ,authHandlers.isAdmin, thoughtCtrl.deleteThought);


// Profile Routes
router.get('/profile'                                            ,authHandlers.isAdmin ,adminCtrl.getProfile)

router.post('/profile/image'                                     ,authHandlers.isAdmin ,uploadCallback ,adminCtrl.addProfileImage)

router.put('/profile/changepassword'                             ,authHandlers.isAdmin ,userCtrl.changePassword);

// Accounts Routes
router.get('/accounts/:page'                                     ,authHandlers.isAdmin ,adminCtrl.getAccounts);

router.delete('/accounts/:id'                                    ,authHandlers.isAdmin ,userCtrl.deleteAccount);

router.put('/accounts/:id/enabledisable'                         ,authHandlers.isAdmin ,userCtrl.enableDisableAccount);

router.put('/accounts/:id/setpassword'                           ,authHandlers.isAdmin ,userCtrl.setPassword);

// Transaction Routes
router.get('/transactions/:page'                                 ,authHandlers.isAdmin ,adminCtrl.getTransactions);

router.delete('/transactions/:id'                                ,authHandlers.isAdmin ,adminCtrl.deleteTransaction);


router.post('/signupadmin'                                       ,authHandlers.isAdmin ,userCtrl.signupAdmin);

// logout route
router.get('/logout'                                             ,authHandlers.isAdmin ,userCtrl.logout);


module.exports = router;