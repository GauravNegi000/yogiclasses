var mongoose            = require('mongoose');

var studentSchema       = new mongoose.Schema({
    name: String,
    motherName: String,
    fatherName: String,
    pAddress: String,
    cAddress: String,
    mobile: String,
    emailId: String,
    dob: String,
    college: String,
    percentage: String,
    fatherOccupation: String,
    motherOccupation: String,
    annualIncome: String,
    subjects: String,
    subjectAllot: String,
    teacherAllot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    courseAllot: [
       {
        
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
          
       }
    ],
    image: {
        fileName: String,
        fileId: String
    },
    notes: [
        {
            title: String,
            sender: String,
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

module.exports          = mongoose.model('Student', studentSchema);