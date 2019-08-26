var express         = require('express');
var router          = express.Router();
var indexCtrl       = require('../controller/indexController');
var userCtrl        = require('../controller/userController');
var courseCtrl      = require('../controller/courseController');
var courseHandlers  = require('../middlewares/courseHandlers');


router.get('/'                                               ,indexCtrl.getIndex);

router.get('/login'                                          ,indexCtrl.getLogin);

router.post('/login'                                         ,userCtrl.login);

// Student Registration Routes
router.get('/registration'                                   ,indexCtrl.getRegistrationForm);

router.post('/registration'                                  ,indexCtrl.postRegistration);

// Teacher Registration Routes
router.get('/registrationteacher'                            ,indexCtrl.getTRegistrationForm);

router.post('/registrationteacher'                           ,indexCtrl.postTRegistration);

// Course Routes

router.get('/courses/:page'                                        ,courseCtrl.getCourseList);

router.get('/courses/single/:slug'                                  ,courseHandlers.checkCourseAllowed, courseCtrl.getCourse);

router.get('/courses/:slug/:topicId/video/:subTopicId'       ,courseHandlers.checkCourseAllowed, courseCtrl.getCourseVideo);

//Other Routes

router.get('/pricing'                                        ,indexCtrl.getPricing);


router.post('/contact'                                       ,indexCtrl.postContact);     


module.exports = router;