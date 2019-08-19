var mongoose        = require('mongoose');

var registrationSchema  = new mongoose.Schema({
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

    isActive: Boolean
});

module.exports = mongoose.model('Registration', registrationSchema);