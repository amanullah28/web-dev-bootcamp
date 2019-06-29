var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    localStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
     
mongoose.connect('mongodb://localhost:27017/auth_demo_app', { useNewUrlParser: true });
var app = express();
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Farhina is best and cutest girl in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==============================
//      ROUTES
//==============================

app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res){
   res.render("secret"); 
});

// AUTH ROUTE  
// SHOW REGISTRATION FORM
app.get("/register", function(req, res){
   res.render("register"); 
});

// HANDLING THE USER SIGNUP
app.post("/register", function(req, res){
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if(err){
           console.log(err);
            return res.render("register");
       } 
           passport.authenticate("local")(req, res, function(){
               res.redirect("/secret");
           });
       
    });
});

// LOGIN ROUTE RENDER LOGIN FORM
app.get("/login", function(req, res){
   res.render("login"); 
});

//LOGIN LOGIC, MIDDLEWARE
app.post("/login", passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login",
}), function(req, res){
});

// logout route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

// middleware to check user is login or not
function isLoggedIn(req, res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server started ........"); 
});