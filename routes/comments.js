const   express     = require("express"),
        router      = express.Router({mergeParams: true}),
        Campground  = require("../models/campgrounds"),
        Comment     = require("../models/comment"),
        middleware  = require("../middleware")

//Comments New
router.get("/new", middleware.isLoggedIn, (req,res)=>{
    Campground.findById(req.params.id, (err,campground)=>{
        if (err){
            console.log(err);
        } else {
        res.render("comments/new", {campground,})
        }
    })
})

//Comments Create
router.post("/", middleware.isLoggedIn, async (req,res)=>{
    try {
        let [campground,comment] = await Promise.all([
            Campground.findById(req.params.id),
            Comment.create(req.body.comment)
        ])
        comment.author.id = req.user._id;
        comment.author.username = req.user.username;
        comment.save()
        campground.comments.push(comment)
        campground.save()
        req.flash("success", "Successfully added comment!")
        res.redirect(`/campgrounds/${campground._id}`)
    } catch (err) {
        console.log(err)
        req.flash("error" ,`Miss Clavel: "Something is not right" ${err}`)
        res.redirect(`/campgrounds/${req.params.id}`)
    }
})

//EDIT ROUTE FORM
router.get("/:comment_id/edit", middleware.checkCommentOwnership, async (req,res)=>{
    let campground = await Campground.findById(req.params.id)
    res.render("comments/edit",{campground, comment: req.comment})
})
//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, (req,res)=>{
    req.comment.text = req.body.comment.text
    req.comment.save()
    req.flash("success", "Comment edited successfully")
    res.redirect(`/campgrounds/${req.params.id}`)
})

//DESTROY + remove comment from Campground
router.delete("/:comment_id", middleware.checkCommentOwnership, async (req,res)=>{
    try{
    req.comment.remove()
    req.flash("success", "Comment removed successfully")
    res.redirect(`/campgrounds/${req.params.id}`)
    } catch (err){
        console.log(err)
        res.redirect("back")
    }
})

module.exports = router
