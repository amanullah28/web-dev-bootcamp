var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var User       = require("../models/comment");
// ALL MIDDLEWARE GOES HERE!!!!

var middlewareObj = {};
// middleware for campground authorization
middlewareObj.checkCampgroundOwnership = function(req, res, next){
     // is user logged in?
    if(req.isAuthenticated()){
          Campground.findById(req.params.id, function(err, foundCampground){
          if(err || !foundCampground){
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
          if(err || !foundComment){
              req.flash("error", "Comment not found");
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


// // USER AUTHORIZATION
//  middlewareObj.checkUserOwnership = function(req, res, next){
//      // is user logged in?
//     if(req.isAuthenticated()){
//           User.findById(req.params.id, function(err, foundUser){
//           if(err){
//               res.redirect("back");
//              } else{
//                   // does user owns the user?
//                   if(foundUser._id.equals(req.user._id)){
//                       next();
//                   } else{
//                       req.flash("error", "please login to do that");
//                      res.redirect("back");
//                   }
//             }
//         });
//     } else{
//         req.flash("error", "You need to be logged in to do that");
//         res.redirect("back");
//     }
   
// }

  // middleware to check logged in or not!
  middlewareObj.isLoggedIn = function(req, res, next){
      if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

  
module.exports = middlewareObj;