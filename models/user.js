var mongoose                = require('mongoose');
var passportLocalMongoose   = require('passport-local-mongoose')
var userSchema      = new mongoose.Schema({
    username:     String,
    password:     String,
    role:         String,
    name:         String,
    image: {
        fileName: String,
        fileId:   String
    },
    studentId: { 
                 type: mongoose.Schema.Types.ObjectId,
                 ref: 'Student'
               },
    teacherId: {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: 'Teacher'
               },
    isActive:     Boolean                      
});

userSchema.plugin(passportLocalMongoose);

module.exports      = mongoose.model('User', userSchema);