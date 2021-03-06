var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
   username: String,
   password: String,
   email: String,
   profileImage: String,
   firstName: String,
   lastName: String,
   isAdmin: {type: Boolean, Default: false}
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);