var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    localStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds");
    
   
mongoose.connect("mongodb://localhost/yelp_camp_v6");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");
 seedDB();
 
 // PASSPORT CONFIGURATION
 app.use(require("express-session")({
     secret: "You are awesome",
     resave: false,
     saveUninitialized: false
 }));
 app.use(passport.initialize());
 app.use(passport.session());
 passport.use(new localStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser()); 
 
 app.use(function(req, res,next){
     res.locals.currentUser=req.user;
     next();
 });
 
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
        res.render("campgrounds/index", {campgrounds: allCampgrounds});   
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

    res.render("campgrounds/new");
});

// SHOW -- show more info about one campground
app.get("/campgrounds/:id", function(req, res){
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



// ================================================================================
//               COMMENTS ROUTE
// ================================================================================

// NEW COMMENTS ROUTE ------- ASSOCIATED WITH A PARTICULAR CAMPGROUND

app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
       res.render("comments/new", {campground: campground});      
    });
   
});

// ROUTE TO CREATE NEW COMMENT

app.post("/campgrounds/:id/comments/",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else{
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/"+campground._id);
               }
               
            });     
        }
    });

});

// ======================
// AUTH ROUTE
// ======================

// SHOW THE REGISTRATIOM FORM
app.get("/register", function(req, res){
   res.render("register"); 
});
// HANDELING THE SIGN UP LOGIC
app.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.render("register");
      } 
      passport.authenticate("local")(req, res, function(){
          res.redirect("/campgrounds");
      })
   });
});

// LOGIN FORM
app.get("/login", function(req, res){
   res.render("login");
});
// LOGIN LOGIC GOES HERE!
app.post("/login", passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});
// LOGOUT LOGIC
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/campgrounds");
});

// middleware to check logged in or not!
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started");
});