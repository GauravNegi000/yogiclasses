var mongoose        = require('mongoose');

var tregistrationSchema  = new mongoose.Schema({
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

    isActive: Boolean
});

module.exports = mongoose.model('Tregistration', tregistrationSchema);