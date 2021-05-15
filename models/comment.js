var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
 

    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
commentSchema.set('toObject', {
versionKey: false,
transform: (doc, ret) => {
delete ret.__v;
return ret;
},
});

module.exports = mongoose.model("Comment", commentSchema);