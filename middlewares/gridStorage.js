const multer        = require('multer');
const crypto        = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const mongoURI      = 'mongodb+srv://gstar7050:gstargaurav@yogiclasses-8hlpe.mongodb.net/test?retryWrites=true&w=majority';
const path          = require('path');

// Create Storage Engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + file.originalname;    // buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

module.exports = {
    storage
}