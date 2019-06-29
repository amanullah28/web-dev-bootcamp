// COMMENTS ROUTE

var express = require("express");
var router  = express.Router({mergeParams:true});
var Card = require("../models/card");
var Comment = require("../models/comment");
var middlewareObj = require("../middleware");
// NEW COMMENTS ROUTE ------- ASSOCIATED WITH A PARTICULAR CAMPGROUND

router.get("/new", middlewareObj.isLoggedIn, function(req, res){
  
    Card.findById(req.params.id, function(err,foundCard ){
        if(err){
            console.log(err);
        }
       res.render("comments/new", {cards: foundCard});      
    });
   
});

// ROUTE TO CREATE NEW COMMENT

router.post("/", middlewareObj.isLoggedIn, function(req, res){
    Card.findById(req.params.id, function(err, foundCard){
        if(err){
            console.log(err);
            res.redirect("/cards");
        } else{
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                   req.flash("error", "Something went wrong");
                   console.log(err);
               } else{
                //   Add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                
                //   
                   foundCard.comments.push(comment);
                   foundCard.save();
                   req.flash("success", "Successfully added comment");
                   res.redirect("/cards/"+foundCard._id);
               }
               
            });     
        }
    });

});

// // ROUTE TO EDIT COMMENTS
// router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, function(req, res){
//     Campground.findById(req.params.id, function(err, foundCampground){
//         if(err || !foundCampground){
//             req.flash("error", "Campground not found");
//             return res.redirect("back")
//         }
//          Comment.findById(req.params.comment_id, function(err, foundComment){
//         if(err){
//             res.redirect("back");
//         } else{
//              res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
//         }
//     });
   
//     });
// });

// COMMENT UPDATE ROUTE
router.put("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else{
           res.redirect("/cards/"+req.params.id);
       }
   });
});

// COMMENT DESTROY ROUTES
router.delete("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res){
 Comment.findByIdAndRemove(req.params.comment_id, function(err){
     if(err){
        res.redirect("back");
     } else{
         req.flash("success", "Comment deleted");
         res.redirect("/cards/"+req.params.id);
     }
 });   
});

module.exports = router;