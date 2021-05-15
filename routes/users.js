var express = require("express");
var router  = express.Router();
var User = require("../models/user");
var middleware = require("../middleware");
var request = require("request");
var User=require("../models/user")
var moment=require("moment");


// router.get("/", function(req, res){
//     // Get all  from DB
//     User.find({}, function(err, allUser){
//        if(err){
//            console.log(err);
//        } else {
//            request('https://maps.googleapis.com/maps/api/geocode/json?address=sardine%20lake%20ca&key=AIzaSyBtHyZ049G_pjzIXDKsJJB5zMohfN67llM', function (error, response, body) {
//             if (!error && response.statusCode == 200) {
//                  // Show the HTML for the Modulus homepage.
//                 res.render("users/index",{users:allUser});

//             }
// });
//        }
//     });
// });

router.get("/:page",function(req,res,next){
  var page=req.params.page||1
  var perPage=6;

  User
  .find({}).skip((perPage*page)-perPage)
  .limit(perPage)
  .exec(function(err,allUser){
    User.countDocuments().exec(function(err,count){
      if(err)return next(err)
        res.render("users/index",{
          users:allUser,
          current:page,
          pages:Math.ceil(count/perPage)
        })
    })
  })
})



//CREATE - add new  to DB
router.post("/1", middleware.isLoggedIn, function(req, res){
    // get data from form and add to c array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newUser = {name: name, image: image, description: desc, author:author}
    // Create a new  and save to DB
    User.create(newUser, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to page
            console.log(newlyCreated);
            res.redirect("/users");
        }
    });
});

//NEW - show form to create new 
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("users/new"); 
});

// SHOW - shows more info about one 
router.get("/1/:id", function(req, res){
    //find the  with provided ID
    User.findById(req.params.id).populate("comments").exec(function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            //render show template with that
            res.render("users/show", {user: foundUser});
        }
    });
});
//delete the id

// DESTROY CAMPGROUND ROUTE
router.delete("/1/:id", function(req, res){
   User.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/");
      } else {
          res.redirect("/");
      }
   });
});


//ediet user details
// router.get("/1/:id/edit",  function(req, res){
//     User.findById(req.params.id).populate("comments").exec(function(err, foundUser){
//         res.render("users/edit", {user: foundUser});
//     });
// });


//edit users
router.get("/1/:id/edit", function(req, res){
    //find the  with provided ID
    User.findById(req.params.id).populate("comments").exec(function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            //render show template with that
            res.render("users/edit", {user: foundUser});
        }
    });
});



//user update
// UPDATE CAMPGROUND ROUTE
router.put("/1/:id", function(req, res){
    // find and update the correct campground
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
       if(err){
           res.redirect("/users/1");
       } else {
           //redirect somewhere(show page)
           res.redirect("/users/1/" + req.params.id);
       }
    });
});




//middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     req.flash("error", "You must be signed in to do that!");
//     res.redirect("/login");
// }

module.exports = router;

