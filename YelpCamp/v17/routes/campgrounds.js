var express = require("express");
var router  = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var middlewareObj = require("../middleware");
var multer = require('multer');
var cloudinary = require('cloudinary');

//====== MULTER CONFIG =============//
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter});

//====== CLOUDINARY CONFIG =============//
cloudinary.config({ 
  cloud_name: 'humblefool', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// INDEX ROUTE -- SHOW ALL CAMPGROUND
router.get("/", function(req,res){
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // SEARCH FOR A CAMPGROUND BY IT'S NAME
        Campground.find({name: regex}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              if(allCampgrounds.length < 1) {
                  req.flash("error", "Sorry, No card is found with that name");
                  return res.redirect("back");
              }
              res.render("campgrounds/index",{campgrounds:allCampgrounds, page: "campgrounds",});
           }
        });
    } else{
         // GET ALL CAMPGROUNDS FROM DB:
         Campground.find({}, function(err, allCampgrounds){
          if(err){
              console.log(err)
          } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});   
          }
       });
     }
   
 });

// CREATE ROUTE -- ADD NEW CAMPGROUND TO DB:
router.post("/", middlewareObj.isLoggedIn, upload.single('image'), function(req, res) {
    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        }
 // add cloudinary url for the image to the campground object under image property
   var url = req.body.image;
       url = result.secure_url;    
// add image's public_id to campground object
      req.body.imageId = result.public_id;
 // Get the Data from the form and push to the array
    var name = req.body.name;
    var price = req.body.price;
    
    var desc = req.body.description; 
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: url,imageId:req.body.imageId, description: desc, author: author};
  Campground.create(newCampground, function(err, newlyCreated){
      if(err){
          console.log(err)
      }else{
             // redirect to campground page
             req.flash("success", "your campground added succesfully");
          res.redirect("/campgrounds");           
      }
  });
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
   if(err || !foundCampground) {
       console.log(err);
       req.flash("error", "Soryy Campground not found");
       res.redirect("back");
   }else{
       // render show template with that campground:
       res.render("campgrounds/show", {campgrounds: foundCampground});
   }
});

}); 

// EDIT CAMPGROUND ROUTES
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership,function(req, res){
          Campground.findById(req.params.id, function(err, foundCampground){
          res.render("campgrounds/edit", {campgrounds: foundCampground}); 
              });
          });
  
// UPDATE CAMPGROUND ROUTES
router.put("/:id", upload.single('image'), function(req, res){
    Campground.findById(req.params.id, async function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(campground.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  campground.imageId = result.public_id;
                  campground.image = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            campground.name = req.body.name;
            campground.description = req.body.description;
            campground.price = req.body.price;
            campground.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
});

// DELETE CAMPGROUND:
router.delete('/:id', middlewareObj.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, async function(err, campground) {
    if(err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
        await cloudinary.v2.uploader.destroy(campground.imageId);
        campground.remove();
        req.flash('success', 'Campground deleted successfully!');
        res.redirect('/campgrounds');
    } catch(err) {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
    }
  });
});

// function for fuzzy search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


module.exports = router;