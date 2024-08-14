const multer = require('multer');
const path = require('path');
const express = require('express');
const app = express();
app.use('/img', express.static(path.join(__dirname, '../img')));
app.use('/img', express.static('../img'));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../img')
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname)
    const xx = Date.now() + '-' + Math.round(Math.random() *1e9)
    cb(null, file.fieldname + '-' + xx + extname)
  }
})
const upload = multer({ storage })
const UploadSingle = (fileName) => upload.single(fileName)

const UploadMUltiple = (fileName) => upload.array(fileName)

module.exports = { UploadSingle, UploadMUltiple }
