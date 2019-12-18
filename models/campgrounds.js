const   mongoose    = require("mongoose"),
        Comment     = require("./comment")

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: String,
    author: {
        id: {
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
})

//WORKING CODE
campgroundSchema.pre("remove", async function (next){
    // console.log("in the pre()")
    try {
        // console.log(this.comments)
        await Comment.deleteMany({
            "_id":{
                $in: this.comments
            }
        })
        // console.log(`comments removed: ${this.comments}`)
    } catch (err) {
        console.log("Comment not removed")
        console.log(err)
    }
})

module.exports = mongoose.model("Campground", campgroundSchema)
