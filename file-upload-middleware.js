const fs = require('fs');
var next = require('next');
var StoredForm = require('./models/StoredForm.js');

function fileUploadMiddleware(req, res, next) {
    console.log(req.body);
    console.log(req.file);
    fs.writeFileSync('./Uploads/' + req.file.originalname,req.file.buffer);
    // next()

    var post_data = {
        'name': req.body.name,
        'file_name': req.file.originalname,
        'upload_date': Date.now()
    };
    //
    req.body.note ? post_data.note = req.body.note : null ;
    StoredForm.create(post_data, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
}

module.exports = fileUploadMiddleware
