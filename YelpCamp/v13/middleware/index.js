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
              req.flash("error", "Campground not find");
               res.redirect("back");
             } else{
                  // does user owns the campgrounds?
                  if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                       next();
                  } else{
                      req.flash("error", "You don't have permission to do that");
                     res.redirect("back");
                  }
            }
        });
    } else{
           req.flash("error", "You need to be logged in to do that");
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
                  if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                       next();
                  } else{
                      req.flash("error", "You don't have permission to do that");
                     res.redirect("back");
                  }
            }
        });
    } else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
   
}

  // middleware to check logged in or not!
  middlewareObj.isLoggedIn = function(req, res, next){
      if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

  
module.exports = middlewareObj;