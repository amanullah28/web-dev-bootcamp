var express = require("express");
var app = express();

// ****** ROUTE SETUP *********
app.get("/", function(req,res){
   res.send("Hi there welcome to my assignment!!!") 
});
app.get("/speak/:animal/", function(req, res){
    console.log(req.params);
    var animal=req.params.animal.toLowerCase();
    // var sound = ""
    // if(animal==="goat"){
    //     sound="may may";
    // }
    // else if(animal==="cow"){
    //     sound = "moo";
    // }
    // else if(animal==="dog"){
    //     sound = "woof woof";
    // }
    
    // ******** ANOTHER WAY OF DOING THAT *********
    var sounds = {
        dog: "woof woof",
        cow: "moo",
        goat: "may may",
        cat: "meow"
    }
    var sound = sounds[animal];
    res.send("The "+animal+" says '"+sound+"'");
});

//***** SECOND ROUTE *****
app.get("/repeat/:message/:times", function(req, res){
   var message = req.params.message;
   var num = Number(req.params.times);
   var result="";
  for(var i=0; i<num; i++)
  {
      result+=message+"  ";
  }
  res.send(result);
});

// ****** THIRD ROUTE*******
app.get("*", function(req, res){
   res.send("soory page not found.... what are you doing with your life"); 
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server has started");
});