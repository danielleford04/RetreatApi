var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Email = require('../models/Email.js');

/* GET ALL EMAILS */
router.get('/', function(req, res, next) {
  Email.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

/* GET SINGLE EMAIL BY ID */
router.get('/:id', function(req, res, next) {
  Email.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET ALL EMAILS BY PHASE BY PHASE_ID */
router.get('/phase/:phase_id', function(req, res, next) {
    Email.find({ phase_id: req.params.phase_id } , function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});


/* SAVE EMAIL */
router.post('/', function(req, res, next) {
  Email.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SEND EMAIL */
router.post('/send', function(req, res, next) {
    // TODO: rewrite w email utility

});

/* UPDATE EMAIL */
router.put('/:id', function(req, res, next) {
  Email.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE EMAIL */
router.delete('/:id', function(req, res, next) {
  Email.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
