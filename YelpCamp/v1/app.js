var express = require("express");
var app = express();
app.set("view engine", "ejs");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var campgrounds = [
        {name: "Digha", image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
        {name: "Rajarhat", image: "https://farm4.staticflickr.com/3881/14146164489_0cb49d2904.jpg"},
        {name: "Rajarhat", image: "https://farm4.staticflickr.com/3881/14146164489_0cb49d2904.jpg"},
        {name: "Rajarhat", image: "https://farm4.staticflickr.com/3881/14146164489_0cb49d2904.jpg"},
        {name: "Rajarhat", image: "https://farm4.staticflickr.com/3881/14146164489_0cb49d2904.jpg"},
        {name: "Rajarhat", image: "https://farm4.staticflickr.com/3881/14146164489_0cb49d2904.jpg"},
      
        ];

app.get("/", function(req,res){
   res.render("landing"); 
});

app.get("/campgrounds", function(req,res){
    
        res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req,res){
    
    // Get the Data from the form and push to the array
   var name = req.body.name;
    var url = req.body.image;
    var newCampGround = {name: name, image: url};
    campgrounds.push(newCampGround);
    // redirect to campground page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req,res){

    res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started");
});