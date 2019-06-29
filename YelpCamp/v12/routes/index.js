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
   res.render("register", {page: "register"}); 
});

// HANDELING THE SIGN UP LOGIC
router.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
      if(err){
            console.log(err);
            // req.flash("error", err.message);
            // res.redirect("/register");
            return res.render("register", {error: err.message}); //err.message come from DB
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


module.exports = router;