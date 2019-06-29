var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
var friends = ["Farhina","Ri2","Irfan","Zafar"];

app.get("/", function(req, res){
   res.render("home"); 
});

app.get("/friend", function(req, res){
   
  res.render("friend", {friends:friends});
});

// POST REQUEST ROUTE

app.post("/addfriend", function(req, res){
    console.log(req.query);
    console.log(req.body);
    var newFriends = req.body.newFriend;
    friends.push(newFriends);
    res.redirect("/friend");
    
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is running");
})