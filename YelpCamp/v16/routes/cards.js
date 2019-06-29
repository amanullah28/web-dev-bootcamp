var express = require("express");
var router  = express.Router({mergeParams:true});
var Card = require("../models/card");
var middlewareObj = require("../middleware");

// INDEX ROUTE -- SHOW ALL CARD
router.get("/", function(req,res){
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // SEARCH FOR A CARD BY IT'S NAME
        Card.find({name: regex}, function(err, allCards){
           if(err){
               console.log(err);
           } else {
              if(allCards.length < 1) {
                  req.flash("error", "Sorry, No card is found with that name");
              }
              res.render("cards/index",{cards:allCards, page: "cards",});
           }
        });
    } else{
         // GET ALL CARDS FROM DB:
         Card.find({}, function(err, allCards){
          if(err){
              console.log(err)
          } else{
            res.render("cards/index", {cards: allCards, page: "cards"});   
          }
       });
     }
   
 });
 
//  GET CARDS BY CATEGORIES
router.get("/r/:category", function(req, res) {
    var category = req.params.category;
    Card.find({category: category}, function(err, allCards) {
        if(err){
            console.log(err);
        } else{
            console.log(allCards);
            res.render("cards/"+req.params.category, {cards: allCards});
        }
    })
})

// CREATE ROUTE -- ADD NEW CARD TO DB:
router.post("/", middlewareObj.isLoggedIn, function(req,res){
    
    // Get the Data from the form and push to the array
    var name = req.body.name;
    var category = req.body.category;
    var subcategory = req.body.subcategory;
    var price = req.body.price;
    var url = req.body.image;
    var desc = req.body.description; 
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCard = {name: name, category: category, subcategory: subcategory, price: price, image: url, description: desc, author: author};
  Card.create(newCard, function(err, newlyCreated){
      if(err){
          console.log(err)
      }else{
             // redirect to card page
             req.flash("success", "Congratulation your card has been added succesfully");
          res.redirect("/cards");           
      }
  });    
});

// NEW ROUTE --- SHOW FORM TO CREATE NEW CAMPGROUNDS:
router.get("/new", middlewareObj.isLoggedIn, function(req,res){
    res.render("cards/new");
});

// SHOW -- show more info about one campground
router.get("/:id", function(req, res){
// find the campground with provided ID:
Card.findById(req.params.id).populate("comments").exec(function(err, foundCard){
   if(err || !foundCard) {
       console.log(err);
       req.flash("error", "Soryy Card not found");
       res.redirect("back");
   }else{
       // render show template with that campground:
       res.render("cards/show", {cards: foundCard});
   }
});

}); 

// EDIT CARD ROUTES
router.get("/:id/edit", middlewareObj.checkCardOwnership, function(req, res){
          Card.findById(req.params.id, function(err, foundCard){
           res.render("cards/edit", {cards: foundCard}); 
              });
          });
  
// UPDATE CAMPGROUND ROUTES
router.put("/:id", middlewareObj.checkCardOwnership, function(req, res){
    Card.findByIdAndUpdate(req.params.id, req.body.card, function(err, updatedCard){
      if(err){
          console.log(err);
          res.redirect("/cards");
      } else{
          res.redirect("/cards/"+req.params.id);
      }
   }); 
});

// DELETE CARDS:
router.delete("/:id", middlewareObj.checkCardOwnership, function(req, res){
   Card.findByIdAndRemove(req.params.id, function(err, removedCard){
       if(err){
           console.log(err);
       }
       req.flash("error", "You deleted "+removedCard.name);
      res.redirect("/cards"); 
   });
});

// function for fuzzy search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


module.exports = router;