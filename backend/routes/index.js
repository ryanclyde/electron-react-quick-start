// var Login = require('../../reactApp/components/login')
var express = require('express');
var router = express.Router();
var models = require('../models/models.js');
var User = models.User;
var Document = models.Document;

router.use(function(req, res, next){
  if (!req.user) {
    res.json({success: false})
  } else {
    return next();
  }
});

router.get('/userdocuments', function(req, res){
  Document.find({author: req.user._id})
  .then((docsArray) => {
    res.json({success: true, docs: docsArray});
  })
})

router.post('/createnewdocument', function(req, res){
  console.log("this is req.user",req.user);

  var newDocument = new Document({
    author: req.user._id,
    password: "12345",
    title: req.body.title,
    collaborators: [],
    content: {}
  })
  console.log("this is Document: ", newDocument);
  newDocument.save(function(err, doc){
    if(err){
      console.log(err)
    } else {
      res.json({success: true, document: newDocument})
    }
  })
});


router.post('/newcollaborator', function(req, res){

  Document.findById(req.body._id)
  .then((doc) => {
    doc.collaborators.push(req.user._id)
    doc.save(function(err, doc){
      if(err){
        console.log(err)
      } else {
        res.json({success: true, document: doc})
      }
    })
  })
  .then((response) => {
    console.log("this is response", response);
    //double check response.document._id
    User.findById(req.user._id)
     .then((user) => {
       user.documentsSharedWithMe.push(response.document._id)
     })
     user.save(function(err, user){
       if(err){
         console.log(err)
       } else {
         res.json({success: true, user: user})
       }
     })
  })


});

router.get('/usershareddocuments', function(req, res){
  Document.find({

  })
})


module.exports = router;
