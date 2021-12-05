let multer = require('multer');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        let suffix = Date.now();
        cb(null, file.fieldname + '-' + suffix + '.csv')
    }
});



module.exports = multer({
    storage: storage, 
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "text/csv" || file.mimetype == "application/vnd.ms-excel") {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});