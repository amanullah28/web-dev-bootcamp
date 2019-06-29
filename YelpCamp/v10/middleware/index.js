var Campground = require("../models/campground");
var Comment    = require("../models/comment");

// ALL MIDDLEWARE GOES HERE!!!!

var middlewareObj = {};
// middleware for campground authorization
middlewareObj.checkCampgroundOwnership = function(req, res, next){
     // is user logged in?
    if(req.isAuthenticated()){
          Campground.findById(req.params.id, function(err, foundCampground){
          if(err){
               res.redirect("back");
             } else{
                  // does user owns the campgrounds?
                  if(foundCampground.author.id.equals(req.user._id)){
                       next();
                  } else{
                     res.redirect("back");
                  }
            }
        });
    } else{
      res.redirect("back");
    }
   
}

// middleware for comment authorization
  middlewareObj.checkCommentOwnership = function(req, res, next){
     // is user logged in?
    if(req.isAuthenticated()){
          Comment.findById(req.params.comment_id, function(err, foundComment){
          if(err){
               res.redirect("back");
             } else{
                  // does user owns the Comments?
                  if(foundComment.author.id.equals(req.user._id)){
                       next();
                  } else{
                     res.redirect("back");
                  }
            }
        });
    } else{
      res.redirect("back");
    }
   
}

  // middleware to check logged in or not!
  middlewareObj.isLoggedIn = function(req, res, next){
      if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

  
module.exports = middlewareObj;