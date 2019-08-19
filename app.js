"use strict"
const express               = require('express');
const app                   = express();
const mongoose              = require('mongoose');
const port                  = process.env.PORT || 3000;
const bodyParser            = require('body-parser');
const methodOverride        = require('method-override');
const passport              = require('passport');
const LocalStrategy         = require('passport-local');
const flash                 = require('connect-flash');
const User                  = require('./models/user');
const authHandlers          = require('./middlewares/authHandlers');
const Grid                  = require('gridfs-stream');
const moment                = require('moment');

const mongoURI              = 'mongodb://localhost:27017/yogiclasses';

mongoose.connect(mongoURI,{
    useNewUrlParser: true, 
    useCreateIndex: true,
    useFindAndModify: false 
});

const conn          = mongoose.connection;


// Init gfs(Grid fs Stream)
let gfs;
conn.once('open', () => {
    // Init Stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
    
    
}).on('error',(error) => console.log('Connection error', error));
// --


// App Config-
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + "/public"));
app.use('/index/*', express.static(__dirname + "/public"));
app.use('/dashboard/*', express.static(__dirname + "/public"));
app.use(flash());
app.locals.moment = moment;

// --


// Passport Config.
app.use(require("express-session")({
    secret: "Hello World",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// --

// Setting Local Variables
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success    = req.flash("success");
    res.locals.error    = req.flash("error");
    next();
});
// --
app.get('/', (req, res) => {
    res.redirect('/index');
});

// Routes for Rendering Image from gridfs //
app.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if(!file || file.length === 0 ) {
            return res.status(404).json({
                err: 'No File Exists'
            })
        }

        if(file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            const readstream = gfs.createReadStream(file); 
                readstream.pipe(res);
        }
        else {
            res.status(404).json({
                err: 'Not an image'
            })
        }
    })
});

// Route to download uploaded files from gridfs
app.post('/files/:filename/download', (req, res) => {

    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (err) {
            return res.status(400).send(err);
        }
        else {
            if (!file || file.length === 0 ) {
            return res.status(404).send('Error on the database looking for the file [ No file such !].');
        }
    
        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', 'attachment; filename="' + file.filename.substring(32) + '"');
    
        var readstream = gfs.createReadStream(file);
    
        readstream.on("error", function(err) { 
            res.end();
        });
        readstream.pipe(res);
    }
      });
    });

// Route for Showing all Uploaded Files
app.get('/files/all/:page', authHandlers.isAdmin, (req, res) => {
    var perPage = 3
    var page = req.params.page || 1
    var count;
    if(page > 0 && !isNaN(page)) {
    gfs.files.count((err, countno) => {
        if(err) count = 0;
        else    count = countno;
    });
    
    gfs.files.find()
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .toArray((err, files) => {        
            if( !files || files.length === 0 ) {
                res.render('filespage', { files: false ,current: page,pages: Math.ceil(count / perPage)});
            } else {
                files.map(file => {
                    if(file.contentType === 'image/jpeg' || file.contentType === 'image/png') file.isImage = true;
    
                    else file.isImage = false;
                });
                res.render('filespage', {
                        files: files ,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    });
            }
    })
} else {
    req.flash('error', 'Something Went Wrong..!');
    res.redirect('back');
}
});

//Routes for Deleting File from gridfs
app.delete('/files/:id',authHandlers.isAdmin ,(req, res) => {
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
        if(err) {
            req.flash('error', 'Something Went Wrong..!');
            res.redirect('back');
        } else {
            req.flash('success', 'Successfully Deleted..!');
            res.redirect('back'); 
        }
    })
});
// --


//============================================//
//         Requiring and using Routes         //
//============================================//

app.use('/index', require('./routes/index'));
app.use('/dashboard/admin', require('./routes/dashboard_admin'));
app.use('/dashboard/student', require('./routes/dashboard_student'));
app.use('/dashboard/teacher', require('./routes/dashboard_teacher'));

// Handling Invalid Requests //
app.get('*', function(req, res) {
    res.render('errorpage');
})
// --

// Listening the port
app.listen(port,process.env.IP,function(){
    console.log("The Server Has Started");
});
