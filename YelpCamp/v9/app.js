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
    
    // Requiring Routes
    var commentRoutes    = require("./routes/comments"),
        campgroundRoutes = require("./routes/campgrounds"),
        indexRoutes      = require("./routes/index");
   
mongoose.connect("mongodb://localhost/yelp_camp_v9");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");
 
//  seedDB();  seed the daata base
 
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
 
 app.use("/", indexRoutes);
 app.use("/campgrounds", campgroundRoutes);
 app.use( commentRoutes);
 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started");
});