/* tslint:disable */
let multer = require('multer');
let path = require('path');
let crypto = require('crypto');
/* tslint:enable */

// image upload
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './temp/uploads/');
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) {
                return cb(err);
            }
            cb(null, raw.toString('hex') + path.extname(file.originalname));
        });
    }
});

export = storage;
