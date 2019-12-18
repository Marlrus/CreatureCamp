const   mongoose    = require("mongoose")
        // Campground  = require("./campgrounds")

const commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectID,
            ref: "User"
        },
        username: String
    }
})

//Working MIDDLEWARE!!!
commentSchema.pre("remove", async function (next){
    let Campground = require("./campgrounds")
    // console.log("in the pre()")
    await Campground.updateOne({comments: this._id}, {
        $pull: {comments: this._id}
    })
    // console.log(`Comment removed from ${Campground.name}`)
})

module.exports = mongoose.model("Comment", commentSchema)