var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Phase = require('../models/Phase.js');

/* GET ALL PHASES */
router.get('/', function(req, res, next) {
  Phase.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

/* GET ALL PHASES BY EVENT BY EVENT_ID */
router.get('/event/:event_id', function(req, res, next) {
    Phase.find({ event_id: req.params.event_id } , function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET SINGLE PHASE BY ID */
router.get('/:id', function(req, res, next) {
  Phase.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE PHASE */
router.post('/', function(req, res, next) {
  Phase.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE PHASE */
router.put('/:id', function(req, res, next) {
  Phase.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE PHASE */
router.delete('/:id', function(req, res, next) {
  Phase.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
