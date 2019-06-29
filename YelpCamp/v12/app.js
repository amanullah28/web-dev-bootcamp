var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      = require("connect-flash"),
    passport   = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds");
    
    // Requiring Routes
    var commentRoutes    = require("./routes/comments"),
        campgroundRoutes = require("./routes/campgrounds"),
        indexRoutes      = require("./routes/index");
   
mongoose.connect("mongodb://localhost/yelp_camp_v12");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
 
//  seedDB();  seed the daata base
// *Now moment is available for use in all of your view files via the variable named moment
 app.locals.moment = require("moment");
 
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
     res.locals.error = req.flash("error");
     res.locals.success = req.flash("success");
     return next();
 });
 
 app.use("/", indexRoutes);
 app.use("/campgrounds", campgroundRoutes);
 app.use("/campgrounds/:id/comments",commentRoutes);
 
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started");
});