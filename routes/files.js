var express = require("express");
var next = require("next");
var router = express.Router();
var mongoose = require("mongoose");
var File = require("../models/File.js");
var fileUploadMiddleware = require("../file-upload-middleware");
var multer = require("multer");
const fs = require("fs");

/* GET ALL FILES */
router.get("/", function (req, res, next) {
    File.find(function (err, products) {
        if (err) return next(err);
        res.json(products);
    });
});

/* GET SINGLE FILE BY ID */
router.get("/:id", function (req, res, next) {
    File.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* SAVE STORED FORMS */
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.post("/", upload.single("file"), fileUploadMiddleware);

/* UPDATE FILE */
router.put("/:id", function (req, res, next) {
    File.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE FILE */
router.delete("/:id", function (req, res, next) {
    File.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;
