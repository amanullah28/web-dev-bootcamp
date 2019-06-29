var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User     = require("../models/user");

//Root Route: HOME ROUTE -- LANDING PAGE
router.get("/", function(req,res){
  res.render("landing"); 
});

// SHOW THE REGISTRATIOM FORM
router.get("/register", function(req, res){
   res.render("register"); 
});

// HANDELING THE SIGN UP LOGIC
router.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
      if(err){
        req.flash("error", err.message);  //err.message comes from mongo if u can console.log(err)
          return res.render("register");
      } 
      passport.authenticate("local")(req, res, function(){
          req.flash("success", "Welcome to the YelpCamp "+user.username);
          res.redirect("/campgrounds");
      });
   });
});

// LOGIN FORM
router.get("/login", function(req, res){
   res.render("login");
});

// LOGIN LOGIC GOES HERE!
router.post("/login", passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});

// LOGOUT LOGIC
router.get("/logout", function(req, res){
   req.logout();
    req.flash("success", "Logged you out!!");
   res.redirect("/campgrounds");
});


module.exports = router;