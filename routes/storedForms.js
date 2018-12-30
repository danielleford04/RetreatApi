var express = require('express');
var next = require('next');
var router = express.Router();
var mongoose = require('mongoose');
var StoredForm = require('../models/StoredForm.js');
var fileUploadMiddleware = require('../file-upload-middleware');
var multer = require('multer');
const fs = require('fs');

/* GET ALL STORED FORMSS */
router.get('/', function(req, res, next) {
  StoredForm.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

/* GET SINGLE STORED FORMS BY ID */
router.get('/:id', function(req, res, next) {
  StoredForm.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});


/* SAVE STORED FORMS */
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.post('/', upload.single('file'), fileUploadMiddleware);


/* UPDATE STORED FORMS */
router.put('/:id', function(req, res, next) {
  StoredForm.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE STORED FORMS */
router.delete('/:id', function(req, res, next) {
  StoredForm.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
