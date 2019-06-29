var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User     = require("../models/user");
var Campground = require("../models/campground");
var middlewareObj = require("../middleware");

//Root Route: HOME ROUTE -- LANDING PAGE
router.get("/", function(req,res){
  res.render("landing"); 
});

// SHOW THE REGISTRATIOM FORM
router.get("/register", function(req, res){
   res.render("register", {page: "register"}); 
});

// HANDELING THE SIGN UP LOGIC
router.post("/register", function(req, res){
   var newUser = new User(
       {
           username: req.body.username, 
           email: req.body.email,
           profileImage: req.body.profileimage,
           firstName: req.body.firstname,
           lastName: req.body.lastname
       });
   if(req.body.adminCode==="Arhina"){
       newUser.isAdmin=true;
   }
   User.register(newUser, req.body.password, function(err, user){
      if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/register");
            // return res.render("register", {error: err.message}); //err.message come from DB
       }
          passport.authenticate("local")(req, res, function(){
          req.flash("success", "Welcome to the YelpCamp "+user.username);
          res.redirect("/campgrounds");
      });
   });
});

// LOGIN FORM
router.get("/login", function(req, res){
   res.render("login", {page: "login"});
});

// LOGIN LOGIC GOES HERE!
//========================================================
// router.post("/login", passport.authenticate("local",{
//     successRedirect: "/campgrounds",
//     failureRedirect: "/login",
// }), function(req, res){
// });
//========================================================

router.post("/login", function (req, res, next) {
  passport.authenticate("local",
    {
      successRedirect: "/campgrounds",
      failureRedirect: "/login",
      failureFlash: "Invalid credentials, please try again.",
      successFlash: "Welcome to YelpCamp, " + req.body.username + "!"
    })(req, res);
});

//==============================================
// router.post('/login',
//   passport.authenticate('local'),
//   function(req, res) {
//     // If this function gets called, authentication was successful.
//     // `req.user` contains the authenticated user.
//     res.redirect("/campgrounds");
//   });
//=================================================

// LOGOUT LOGIC
router.get("/logout", function(req, res){
   req.logout();
    req.flash("success", "Logged you out!!");
   res.redirect("/campgrounds");
});

//========== USER PROFILE ROUTE=================//
router.get("/users/:id", middlewareObj.isLoggedIn, function(req, res){
  User.findById(req.params.id, function(err, foundUser){
     if(err){
         console.log(err);
         req.flas("error", "User not found");
         res.redirect("/");
     } else{
         Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds){
             if(err){
                 console.log(err);
                 req.flas("error", "User not found");
                 res.redirect("/");
             } else{
                  res.render("users/show", {user: foundUser, campgrounds: campgrounds});
             }
         });
     }
  });
});
//============ =======USER EDIT FORM===================================================//
router.get("/users/:id/edit", middlewareObj.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
       if(err){
           req.flash("error", "User not found");
       } else{
           res.render("users/edit", {user: foundUser}); 
       }
    });
   
});

//============USER UPDATE ROUTE============//
router.put("/users/:id", function(req, res){
   
   User.findByIdAndUpdate(req.params.id, req.body.user, function(err, user){
      if(err){
          console.log(err);
          req.flash("error", "Something went wrong");
          res.redirect("back");
      } else{
          res.redirect("/users/"+req.params.id);
      }
   }); 
});
//=======================================//
module.exports = router;