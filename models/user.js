var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

var UserSchema = new mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	batchof: {
		type: String
	},
	name: {
		type: String
	},
	profileimage:{
		type: String
	},
	bio:{
		type: String
	},
	status:{
		type: String
	},
	insta:{
		type:String
	},
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});




UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);