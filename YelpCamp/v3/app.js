var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB     = require("./seeds");
    
    seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v3");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// HOME ROUTE -- LANDING PAGE
app.get("/", function(req,res){
  res.render("landing"); 
});

// INDEX ROUTE -- SHOW ALL CAMPGROUND

app.get("/campgrounds", function(req,res){
    
    // GET ALL CAMPGROUND FROM DB:
    
    Campground.find({}, function(err, allCampgrounds){
      if(err){
          console.log(err)
      } else{
        res.render("index", {campgrounds: allCampgrounds});   
      }
    });
});

// CREATE ROUTE -- ADD NEW CAMPGROUND TO DB:
app.post("/campgrounds", function(req,res){
    
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
app.get("/campgrounds/new", function(req,res){

    res.render("new");
});

// SHOW -- show more info about one campground
app.get("/campgrounds/:id", function(req, res){
// find the campground with provided ID:
Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
   if(err) {
       console.log(err);
   }else{
       console.log(foundCampground);
       // render show template with that campground:
       res.render("show", {campground: foundCampground});
   }
});

});   
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started");
});