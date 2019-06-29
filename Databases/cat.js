    var mongoose = require("mongoose");
    mongoose.connect("mongodb://localhost/cat_app");
    var catSchema = new mongoose.Schema({
        name: String,
        age: Number,
        temperament: String
    });
    
    var Cat = mongoose.model("Cat", catSchema);
    
    // Add A cat to the DB
    
    // var george = new Cat({
    //     name: "Mrs. Norris",
    //     age: 7,
    //     temperament: "Evil"
    // });
    
    // george.save(function(err, cat){
    //     if(err){
    //         console.log("SOMETHING WENT WRONG!!");
    //     }else{
    //         console.log("WE JUST SAVED A CAT TO DB!!");
    //         console.log(cat);
    //     }
    // });
    
    // Another Method to Add Cats..
    
    Cat.create({
        name: "Meri junglee billi, Farhina",
        age: 20,
        temperament: "calm"
    }, function(err, cat){
       if(err){
           console.log("It's An Error");
           console.log(err);
       } else{
           console.log(cat);
       }
    });
    
    // retriving the cat from DB:
    
    Cat.find({}, function(err, cats){
        if(err){
            console.log("OH NO, IT'S AN ERROR");
            console.log(err);
        }else{
            console.log("HERE IS THE ALL CATS.....");
            console.log(cats);
        }
    })