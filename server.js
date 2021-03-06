const express = require('express')
const next = require('next')
const multer = require('multer')
//const cloudinary = require('cloudinary')
const bodyParser = require('body-parser')
const fileUploadMiddleware = require('./file-upload-middleware')
var mongoose = require('mongoose');
const passport = require("passport");

var cors = require('cors')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/retreats')
    .then(() =>  console.log('connection successful'))
    .catch((err) => console.error(err));


var users = require('./routes/users');
var events = require('./routes/events');
var tasks = require('./routes/tasks');
var instructions = require('./routes/instructions');
var phases = require('./routes/phases');
var emails = require('./routes/emails');
var retreatants = require('./routes/retreatants');
var files = require('./routes/files');
var defaults = require('./routes/defaults');

app.prepare()
  .then(() => {
    const server = express()

      server.use(function(req, res, next) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
          res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
          next();
      });
      server.use(cors());
    server.use(bodyParser.urlencoded({ extended: true }))
    server.use(bodyParser.json())

      // Passport middleware
      server.use(passport.initialize());
      // Passport config
      require("./validation/passport")(passport);

    // const storage = multer.memoryStorage()
    // const upload = multer({ storage })
    //
    //   server.post('/upload', upload.single('image'), function(req, res, next) {
    //         console.log(req.body)
    //       const image = req.file.buffer
    //       console.log(image);
    //
    //   });
    //
    // server.post('/files', upload.single('file'), fileUploadMiddleware)
    //
    // server.post('/api/changeProfilePicture', (req, res) => {
    //   console.log('/api/changeProfilePicture')
    //   console.log(req.body)
    //   // you can do whatever you want with this data
    //   // change profile pic, save to DB, or send it to another API
    //   res.end()
    // })

      server.use('/users', users);
      server.use('/emails', passport.authenticate('jwt', {session: false}), emails);
      server.use('/events', passport.authenticate('jwt', {session: false}), events);
      server.use('/tasks', passport.authenticate('jwt', {session: false}), tasks);
      server.use('/instructions', passport.authenticate('jwt', {session: false}), instructions);
      server.use('/phases', passport.authenticate('jwt', {session: false}), phases);
      server.use('/retreatants', passport.authenticate('jwt', {session: false}), retreatants);
      server.use('/files', passport.authenticate('jwt', {session: false}), files);
      server.use('/defaults', passport.authenticate('jwt', {session: false}), defaults);

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
