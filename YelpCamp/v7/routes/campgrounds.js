var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
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
router.post("/", function(req,res){
    
    // Get the Data from the form and push to the array
  var name = req.body.name;
    var url = req.body.image;
    var desc = req.body.description; 
    var newCampGround = {name: name, image: url, description: desc};
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
router.get("/new", function(req,res){

    res.render("campgrounds/new");
});

// SHOW -- show more info about one campground
router.get("/:id", function(req, res){
// find the campground with provided ID:
Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
   if(err) {
       console.log(err);
   }else{
    //   console.log(foundCampground);
       // render show template with that campground:
       res.render("campgrounds/show", {campground: foundCampground});
   }
});

}); 

module.exports = router;