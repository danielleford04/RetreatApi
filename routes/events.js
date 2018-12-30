var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Event = require('../models/Event.js');
var Phase = require('../models/Phase.js');

/* GET ALL EVENTS */
router.get('/', function(req, res, next) {
  Event.find(function (err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

/* GET SINGLE EVENT BY ID */
router.get('/:id', function(req, res, next) {
  Event.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* CREATE EVENT */
router.post('/', function(req, res, next) {
  Event.create(req.body, function (err, post) {
    if (err) return next(err);
    console.log(post);
    createEventPhases();

    function createEventPhases() {
      var registration_body = {
        'name': "Registration",
        'event_id': post._id
      };
      var preparation_body = {
        'name': "Preparation",
        'event_id': post._id
      };
      var arrival_body = {
        'name': "Arrival",
        'event_id': post._id
      };
      var during_body = {
        'name': "During",
        'event_id': post._id
      };
      var closing_body = {
        'name': "Closing",
        'event_id': post._id
      };
      var follow_up_body = {
        'name': "Follow Up",
        'event_id': post._id
      };
      Phase.create(registration_body, function (err, post) {
        if (err) return next(err);
        Phase.create(preparation_body, function (err, post) {
          if (err) return next(err);
          Phase.create(arrival_body, function (err, post) {
            if (err) return next(err);
            Phase.create(during_body, function (err, post) {
              if (err) return next(err);
              Phase.create(closing_body, function (err, post) {
                if (err) return next(err);
                Phase.create(follow_up_body, function (err, post) {
                  if (err) return next(err);

                });
              });
            });
          });
        });
      });
    }
      res.json(post);
  });

});

/* UPDATE EVENT */
router.put('/:id', function(req, res, next) {
  Event.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE EVENT */
router.delete('/:id', function(req, res, next) {
  Event.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);

      Phase.deleteMany({ event_id: req.params.id }, function (err) {
          if (err) return handleError(err);
          // deleted at most one tank document
      });
    res.json(post);
  });
});

module.exports = router;
