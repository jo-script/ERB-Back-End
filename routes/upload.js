// const express = require('express');
const multer = require('multer');
const path = require('path');

// إعداد تخزين الملفات باستخدام Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../img'));  // حفظ الملفات في فولدر 'uploads'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);  // تسمية الملف باستخدام التاريخ واسم الملف الأصلي
  }
});

const upload = multer({ storage: storage });

const uploadImg = (file) => upload.single(file)

module.exports = uploadImg;
