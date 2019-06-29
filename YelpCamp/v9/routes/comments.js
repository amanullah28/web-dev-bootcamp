// COMMENTS ROUTE

var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// NEW COMMENTS ROUTE ------- ASSOCIATED WITH A PARTICULAR CAMPGROUND

router.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
  
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
       res.render("comments/new", {campground: campground});      
    });
   
});

// ROUTE TO CREATE NEW COMMENT

router.post("/campgrounds/:id/comments",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else{
                //   Add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                //   Save Comment
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/"+campground._id);
               }
               
            });     
        }
    });

});

// middleware to check logged in or not!
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;