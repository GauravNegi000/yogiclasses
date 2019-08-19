var express         = require('express');
var router          = express.Router();
var userCtrl        = require('../controller/userController');
var authHandlers    = require('../middlewares/authHandlers');
var teacherCtrl     = require('../controller/teacherController');
var multer          = require('multer');
var storage         = require('../middlewares/gridStorage').storage;
 
// Image Upload multer Configuration
var fileFilterImage      = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        req.fileValidationError = false;
        cb(null, true);
    } else {
        req.fileValidationError = true;
        return cb(null, false, new Error('goes wrong on the mimetype'));
    }
}; 
var maxSizeImage = 1024 * 400;

var uploadImage          = multer({
    storage: storage,
    limits:{
        fileSize: maxSizeImage
    },
    fileFilter: fileFilterImage
}).single('image');

var uploadImageCallback = (req, res, next) => 
    uploadImage(req, res, function(err) {
        if (err) {
            req.flash('error', err.message );
            return res.redirect('back');
        }   else {
            next();
        }
})
// --

// File [ Notes ] upload multer configuration
var fileFilterNotes      = (req, file, cb) => {
    if(file.mimetype === 'application/pdf' || file.mimetype === 'text/plain' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ) {
        req.fileValidationError = false;
        cb(null, true);
    } else {
        req.fileValidationError = true;
        return cb(null, false, new Error('goes wrong on the mimetype'));
    }
}; 
var maxSizeNotes = 1024 * 1024 * 12;

var uploadNotes          = multer({
    storage: storage,
    limits:{
        fileSize: maxSizeNotes
    },
    fileFilter: fileFilterNotes
}).single('notes');

var uploadNotesCallback = (req, res, next) => 
    uploadNotes(req, res, function(err) {
        if (err) {
            req.flash('error', err.message );
            return res.redirect('back');
        }   else {
            next();
        }
})

// --

router.get('/'                                                   ,authHandlers.isTeacher ,teacherCtrl.getDashboard);

router.get('/notes'                                              ,authHandlers.isTeacher ,teacherCtrl.getNotes);

router.post('/students/:id'                                      ,authHandlers.isTeacher ,uploadNotesCallback, teacherCtrl.sentNotes);

router.get('/transactions'                                       ,authHandlers.isTeacher ,teacherCtrl.getTransactions);

router.delete('/notes/:id'                                       ,authHandlers.isTeacher ,teacherCtrl.deleteNotes);

router.get('/profile'                                            ,authHandlers.isTeacher ,teacherCtrl.getProfile);

router.post('/profile/:id/image'                                 ,authHandlers.isTeacher ,uploadImageCallback ,teacherCtrl.addProfileImage);

router.put('/profile/changepassword'                             ,authHandlers.isTeacher ,userCtrl.changePassword);

// logout route
router.get('/logout'                                             ,authHandlers.isTeacher ,userCtrl.logout);


module.exports = router;