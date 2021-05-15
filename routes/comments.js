var express = require("express");
var router  = express.Router({mergeParams: true});
var User = require("../models/user");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    
    console.log(req.params.id);
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {user: user});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup  using ID

   User.findById(req.params.id, function(err, user){
       if(err){
           console.log(err);
           res.redirect("/users/1");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
            if(req.body.ano==="checked"){
              comment.author.username = "Anonymous";
            } 
            else{
              comment.author.username=req.user.username;
            }
               //add username and id to comment
               comment.author.id = req.user._id;
              
               //save comment
               comment.save();
               user.comments.push(comment);
               user.save();
               console.log(comment);
               console.log(req.body.ano)
               req.flash('success', 'Created a comment!');
               res.redirect('/users/1/'+user._id);
           }
        });
       }
   });
});

router.get("/:commentId/edit", middleware.isLoggedIn, function(req, res){
    // find  by id
    Comment.findById(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
             res.render("comments/edit", {user_id: req.params.id, comment: comment});
        }
    })
});

router.put("/:commentId", function(req, res){
   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
       if(err){
           res.render("edit");
       } else {
           res.redirect("/users/1/"+ req.params.id);
       }
   }); 
});

router.delete("/:commentId",middleware.checkUserComment, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err){
            console.log("PROBLEM!");
        } else {
            res.redirect("/users/1/" + req.params.id);
        }
    })
});

module.exports = router;