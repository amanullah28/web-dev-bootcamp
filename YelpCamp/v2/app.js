var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");
  
mongoose.connect("mongodb://localhost/yelp_camp");
    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
     name: String,
     image: String,
     description: String
    });
    
var Campground = mongoose.model("Campground", campgroundSchema);
    
// ADD NEW CAMPGROUND TO DB:
// Campground.create({
//     name: "Arhina Hill",
//     image: "https://pixabay.com/get/eb30b00d21f0053ed1584d05fb1d4e97e07ee3d21cac104497f7c07caee9b2b1_340.jpg",
//     description: "This is awesome but here is no water no bathroom "
// }, function(err, campground){
//   if(err){
//       console.log(err);
//   } else{
//       console.log("NEWLY CREATED CAMPGROUND IS:  ");
//       console.log(campground);
//   }
// });



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
Campground.findById(req.params.id, function(err, foundCampground){
   if(err) {
       console.log(err);
   }else{
       res.render("show", {campground: foundCampground});
   }
});
// render show template with that campground:
}); 
 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started");
});