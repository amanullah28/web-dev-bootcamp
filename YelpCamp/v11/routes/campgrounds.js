var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middlewareObj = require("../middleware");
// INDEX ROUTE -- SHOW ALL CAMPGROUND

router.get("/", function(req,res){
    // GET ALL CAMPGROUND FROM DB:
    
    Campground.find({}, function(err, allCampgrounds){
      if(err){
          console.log(err)
      } else{
        res.render("campgrounds/index", {campgrounds: allCampgrounds});   
      }
    });
});

// CREATE ROUTE -- ADD NEW CAMPGROUND TO DB:
router.post("/", middlewareObj.isLoggedIn, function(req,res){
    
    // Get the Data from the form and push to the array
    var name = req.body.name;
    var price = req.body.price;
    var url = req.body.image;
    var desc = req.body.description; 
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampGround = {name: name, price: price, image: url, description: desc, author: author};
  Campground.create(newCampGround, function(err, newlyCreated){
      if(err){
          console.log(err)
      }else{
             // redirect to campground page
          res.redirect("/campgrounds");           
      }
  });    
});

// NEW ROUTE --- SHOW FORM TO CREATE NEW CAMPGROUNDS:
router.get("/new", middlewareObj.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

// SHOW -- show more info about one campground
router.get("/:id", function(req, res){
// find the campground with provided ID:
Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
   if(err) {
       console.log(err);
   }else{
       // render show template with that campground:
       res.render("campgrounds/show", {campground: foundCampground});
   }
});

}); 

// EDIT CAMPGROUND ROUTES
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, function(req, res){
          Campground.findById(req.params.id, function(err, foundCampground){
           res.render("campgrounds/edit", {campground: foundCampground}); 
              });
          });
  
// UPDATE CAMPGROUND ROUTES
router.put("/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCampground){
      if(err){
          console.log(err);
          res.redirect("/campgrounds");
      } else{
          res.redirect("/campgrounds/"+req.params.id);
      }
   }); 
});

// DELETE CAMPGROUNDS:
router.delete("/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           console.log(err);
       }
      res.redirect("/campgrounds"); 
   });
});

module.exports = router;