var express = require("express");
var app = express();

// "/" ==> Hi There!!!
app.get("/", function(req, res){
    res.send("Hi There!!");
});
// "/bye" ==> GoodBye!!!
app.get("/bye", function(req, res){
    res.send("GoodBye!!");
});
// "/dog" ==> Meow
app.get("/dog", function(req, res){
res.send("Meow");    
});

app.get("/r/:subredditName", function(req, res){
   var subreddit = req.params.subredditName;
   res.send("WELCOME TO THE "+subreddit.toUpperCase()+" SUBREDDIT");
   
});

app.get("/r/:subredditName/comments/:id/:title/", function(req, res){
    // var subreddit = req.params.subredditName;
   res.send("Welcome to comments page!!!"); 
//   console.log(subreddit);
});

// "*" ==> for any request whose route is not defined 

app.get("*", function(req, res){
   res.send("Hello from star!!"); 
});
// Tell express to listen for request (start the server)

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});