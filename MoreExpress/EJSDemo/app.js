var express = require("express");
var app = express();
app.use(express.static("public"));  // tell the express to serve the content of public directory

app.set("view engine", "ejs");   // THIS WILL ALLOW TO USE EJS FILE WITHOUT .ejs EXTENSION


app.get("/", function(req, res){
    res.render("home");
//   res.send("<h1>Welcome</h1> <h2>to my home page</h2>"); 
});

app.get("/fallinlovewith/:thing", function(req, res){
    var thing = req.params.thing;
   res.render("love",{thingVar:thing}); 
});

app.get("/post", function(req, res){
    
   var posts = [
       {title: "Farhina smile is dammnn cute!!!", author: "Aman"},
       {title: "Farhina is Adorable", author: "Arman"},
       {title: "Farhina is best", author: "Amanullah" }
       ]; 
       res.render("post", {posts:posts})
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is listening");
});