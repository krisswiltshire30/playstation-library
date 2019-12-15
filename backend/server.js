const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');
const multer = require('multer');
const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

const dbRoute =
  'mongodb+srv://test-user:JUQSjUXigU6Kvnc1@mongo-test-rxsz9.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(dbRoute, {
  useNewUrlParser: true
});

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(logger('dev'));

router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({
      success: false,
      error: err
    });
    return res.json({
      success: true,
      data: data
    });
  });
});

router.post('/updateData', (req, res) => {
  const {
    id,
    update
  } = req.body;
  Data.findByIdAndUpdate(id, update, (err) => {
    if (err) return res.json({
      success: false,
      error: err
    });
    return res.json({
      success: true
    });
  });
});

router.delete('/deleteData', (req, res) => {
  const {
    id
  } = req.body;
  Data.findByIdAndRemove(id, (err) => {
    if (err) return res.send(err);
    return res.json({
      success: true
    });
  });
});

router.post('/putData', (req, res) => {
  let data = new Data();

  const {
    id,
    name,
    platform,
    genre,
    release_date,
    players,
    publisher,
    box_art,
  } = req.body;

  if ((!id && id !== 0) || !name) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS',
    });
  }
  data.id = id;
  data.name = name;
  data.platform = platform;
  data.genre = genre;
  data.release_date = release_date;
  data.players = players;
  data.publisher = publisher;
  data.box_art = box_art;

  data.save((err) => {
    if (err) return res.json({
      success: false,
      error: err
    });
    return res.json({
      success: true
    });
  });
});
app.use('/api', router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));