var express         = require('express');
var router          = express.Router();
var userCtrl        = require('../controller/userController');
var authHandlers    = require('../middlewares/authHandlers');
var studentCtrl     = require('../controller/studentController');
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

router.get('/'                                                   ,authHandlers.isStudent ,studentCtrl.getDashboard);

router.get('/notes'                                              ,authHandlers.isStudent ,studentCtrl.getNotes);

router.get('/transactions'                                       ,authHandlers.isStudent ,studentCtrl.getTransactions);

router.delete('/notes/:id'                                       ,authHandlers.isStudent ,studentCtrl.deleteNotes);

router.get('/profile'                                            ,authHandlers.isStudent ,studentCtrl.getProfile);

router.post('/profile/:id/image'                                 ,authHandlers.isStudent ,uploadCallback ,studentCtrl.addProfileImage);

router.put('/profile/changepassword'                             ,authHandlers.isStudent ,userCtrl.changePassword);

// logout route
router.get('/logout'                                             ,authHandlers.isStudent ,userCtrl.logout);


module.exports = router;