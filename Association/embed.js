var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blog_demo");

// POST-- title, content
var postSchema = new mongoose.Schema({
    title: String,
    content: String
});
 var Post = mongoose.model("Post", postSchema);
 
// USER-- email, name
var userSchema = new mongoose.Schema({
      email: String,
      name: String,
      posts: [postSchema]
  });
  var User = mongoose.model("User", userSchema);

//   var newUSer = new User({
//       email: "arman121@gmail.com",
//       name: "Arman"
//      });
     
//      newUSer.posts.push({
//          title: "I love someone",
//          content: "I love her a lot, you can't understand"
//      });
     
//     newUSer.save(function(err, user){
//         if(err){
//             console.log(err);
//         }else{
//             console.log(user);
//         }
//     });
    
    User.findOne({name: "Arman"},function(err, user){
      if(err){
        //   console.log(err);
       } else{
           user.posts.push({
               title: "girls i love her a lot",
               content: "she is ri2 ri2 ri2 and ri2 "
           });
           user.save(function(err, user){
              if(err){
                  console.log(err)
              } else{
                  console.log(user);
              }
           });
       }
    });

// var newPost = new Post({
//     title: "Reflection on apples",
//     content: "They are delicious"
// });
// newPost.save(function(err, post){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(post);
//     }
// })