var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Retreatant = require('../models/Retreatant.js');

/* GET ALL RETREATANTS */
router.get('/', function(req, res, next) {
  Retreatant.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

/* GET ALL RETREATANTS BY EVENT BY EVENT_ID */
router.get('/event/:event_id', function(req, res, next) {
    Retreatant.find({ event_id: req.params.event_id } , function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* GET SINGLE RETREATANT BY ID */
router.get('/:id', function(req, res, next) {
  Retreatant.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE RETREATANT */
router.post('/', function(req, res, next) {
  Retreatant.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE RETREATANT */
router.put('/:id', function(req, res, next) {
  Retreatant.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE RETREATANT */
router.delete('/:id', function(req, res, next) {
  Retreatant.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
