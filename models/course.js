var mongoose        = require('mongoose');
var slug            = require('mongoose-slug-generator');
mongoose.plugin(slug);
var courseSchema    = new mongoose.Schema({
    title:  String,
    slug:   { type:String, slug: "title", unique:true },
    description:    String,
    description2:   String,
    image: {
        fileName: String,
        fileId: String
    },
    outline: [
        {
          topic: String,
          subTopic: [
               {
                name:       String,
                videoUrl:   String
               }
           ]
        }
    ],
    courseFee: String,
    trainer:   String,
    category:  String,
    studentsEnrolled:[
        {        
             
                type: mongoose.Schema.Types.ObjectId,
                ref:  'Student'
            
        }        
    ],
    isActive: Boolean
});


let Course      = mongoose.model('Course', courseSchema);
module.exports  = Course;