var mongoose       = require('mongoose');

var teacherSchema  = new mongoose.Schema({
    name: String,
    motherName: String,
    fatherName: String,
    pAddress: String,
    cAddress: String,
    mobile: String,
    emailId: String,
    dob: String,
    college: String,
    academic: String,
    videourl: String,
    subjects: String,
    studentAlloted: [
        {        
             
            type: mongoose.Schema.Types.ObjectId,
            ref:  'Student'
        
        }  
    ],
    image: {
        fileName: String,
        fileId: String
    },
    notes: [
        {
            title: String,
            receiver: String,
            fileName: String
        }
    ],
    transactions: [
        {
            subject: String,
            month:   String,
            amount:  String,
            paid:    String,
            pmode:   String,
            pdetails:String,
            created: {type:Date, default:Date.now}
        }
    ],
    isActive: Boolean,
    hasAccount: Boolean
});

module.exports  = mongoose.model('Teacher', teacherSchema);