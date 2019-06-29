var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
    mongoose   = require("mongoose"),
    express    = require("express"),
    app        = express();

mongoose.connect("mongodb://localhost/restful_blog_app");
// APP CONFIG:

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG:

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body:  String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema)

// RESTful Route config:
app.get("/", function(req, res){
   res.redirect("/blogs"); 
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
       if(err){
           console.log("ERROR!!")
       } else{
            res.render("index", {blogs: blogs});
       }
    });
   });
   
   // NEW ROUTE
   app.get("/blogs/new", function(req, res){
      res.render("new"); 
   });
   
   // CREATE ROUTE
   app.post("/blogs", function(req, res){
      Blog.create(req.body.blog, function(err, newBlog){
          if(err){
              res.render("new");
          }
          else{
               res.redirect("/blogs")    
          }
      });
   });
   
   // show route
   
   app.get("/blogs/:id", function(req, res){
     Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show", {blog: foundBlog});
        }
     });
   });
   
   //EDIT ROUTE
   
   app.get("/blogs/:id/edit", function(req, res){
       Blog.findById(req.params.id, function(err, foundBlog){
          if(err){
              res.redirect("/blogs");
          } else{
               res.render("edit", {blog: foundBlog}); 
          }
       });
     
   });
   
   // UPDATE RPUTE:
   
   app.put("/blogs/:id", function(req, res){
     Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
      if(err){
          res.redirect("/blogs");
      }   else{
          res.redirect("/blogs/"+req.params.id)
      }
     });
   });
   
   // DELETE ROUTE:
   
   app.delete("/blogs/:id", function(req, res){
     Blog.findByIdAndRemove(req.params.id, function(err){
         if(err){
             res.redirect("/blogs");
         }else{
             res.redirect("/blogs");
         }
     });
   });
   
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING");
});