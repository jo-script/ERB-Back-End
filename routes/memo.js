const express = require('express');
const router = express.Router();
const Memo = require('../models/Memo'); // Assuming your schema is in the models folder
const nodemailer = require('nodemailer');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/getMemo', authMiddleware, async (req, res) => {
  try {
    const memo = await Memo.find({ user: req.user._id })
    res.status(200).json(memo)
  } catch (error) {
    res.status(400).json({ error: err.message });

  }


})

// Route to create a new memo
router.post('/createMemo', authMiddleware, async (req, res) => {
  // console.log(req);
  try {
    const memo = new Memo({...req.body, user:req.user._id});
    await memo.save();

    // Send email to the recipient
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: req.user.email, // Your email
        pass: process.env.EMAIL_PASS,   // Your email password
      }
    });

    let mailOptions = {
      from: req.body.sentFrom,
      to: req.body.sentTo,
      subject: req.body.title,
      text: req.body.paragraph, 
      action: req.body.action,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(200).json({ memo, info });
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route to delete a memo
router.delete('/deleteMemo/:id', async (req, res) => {
  try {
    const memo = await Memo.findByIdAndDelete(req.params.id);
    res.status(200).json(memo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
