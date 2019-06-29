const express = require("express");
const app = express();
app.set("view engine", "ejs");

// configure dotenv
    require('dotenv/config');

const route = process.env.ROUTE;
console.log(route);
app.get("/", function(req, res){
    res.render("home");
});

app.get("/about", function(req, res){
    res.render("about");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});