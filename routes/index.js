var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var multer = require('multer');
var path=require("path")
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
const rateLimit = require("express-rate-limit");


const createAccountLimiter = rateLimit({
  windowMs: 60*1000 , // 1 hr window
  max: 3, // start blocking after 3 requests
  message:
    "Too many accounts created from this IP, please try again after an hour"
});

//root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic

//signup logic
var Storage=multer.diskStorage({
  destination:"./uploads",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
  }
});

var upload=multer({storage:Storage})



router.use(expressValidator())




router.post('/register', [upload.single('profileimage') ,createAccountLimiter],function(req, res, next) {
  var name = req.body.name;
  var batchof = req.body.batchof;
  var username = req.body.username;
  var password = req.body.password;
  var password1 = req.body.password1;
  var status=req.body.status;
  var bio=req.body.bio;
  var insta=req.body.insta;
  var captchaInput=req.body.captchaCheck;
  var captchaCode=req.body.code;
  if(req.file){
    console.log('Uploading File...');
    var profileimage = req.file.filename;
  } else {
    console.log('No File Uploaded...');
    var profileimage = 'noimage.jpg';
  }
  



    // Form Validator
  req.checkBody('name','Name field is required').notEmpty();
  req.checkBody('batchof','Batch field is required').notEmpty();
  req.checkBody('username','Username field is required').notEmpty();
  req.checkBody('password','Password field is required').notEmpty();
  req.checkBody('password1','Passwords do not match').equals(req.body.password);

   req.checkBody('name','Name field is required').isString();
  req.checkBody('batchof','Batch field is required').isString();
  req.checkBody('username','Username field is required').isString();
  req.checkBody('password','Password field is required').isString();
console.log(name)
var captcha=false;
  if(captchaInput.length===0||captchaInput!=captchaCode){
    captcha=true
    console.log("empty")
  }else{
     captcha=false;
  }

  console.log(captchaInput);
  console.log(captchaCode)
  if(captcha){
    console.log("working")
  }
console.log(captchaInput);
  // Check Errors
  var errors = req.validationErrors();

  if(!errors && !req.file && !captcha ){
    res.render('register', {
      errors: errors
    });
  } 
  else{
    var newUser = new User({
      name: name,
      batchof: batchof,
      username: username,
      password: password,
      profileimage: profileimage,
      bio:bio,
      status:status,
      insta:insta
    });

     User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
             res.location('/users/1');          
           res.redirect("/users/1"); 
        });
    });
   
    
  }
});









//show login form
router.get("/login",createAccountLimiter, function(req, res){
   res.render("login"); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/users/1",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "LOGGED YOU OUT!");
   res.redirect("/");
});


router.get("/faq", function(req, res){
   res.render("faq"); 
});



module.exports = router;