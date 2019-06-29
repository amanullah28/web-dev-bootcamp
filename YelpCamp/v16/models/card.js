var mongoose = require("mongoose");
var cardSchema =new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   price: String,
   category: {type: String, required: true},
   subcategory: {type: String, required: true},
   createdAt: {type: Date, default: Date.now},
   author: {
      id:{
          type: mongoose.Schema.Types.ObjectId,
           ref: "User"
      },
      username: String
   },
   
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Card",cardSchema);