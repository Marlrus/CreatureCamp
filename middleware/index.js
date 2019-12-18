//All the middleware goes here
const   middlewareObj   = {},
        Campground      = require("../models/campgrounds"),
        Comment         = require("../models/comment")

middlewareObj.checkCampgroundOwnership = (req,res,next)=>{
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err,foundCampground)=>{
            if (err || !foundCampground){
                req.flash("error", "Campground not found!")
                res.redirect("back")
            } else {
                //does user match cg?
                if(foundCampground.author.id.equals(req.user._id)){
                    req.campground = foundCampground
                    next()
                    // res.render("campgrounds/edit", {campground: foundCampground})
                } else{
                    req.flash("error","Sneaky! Yet again, not sneaky enough! You own this campground not!")
                    res.redirect("/ysnp")
                }
            }
        })
    }else{
        req.flash("error","Sneaky! Yet, not sneaky enough! You own not this campground! In fact, you own nothing! Log in, fool!")
        res.redirect("/ysnp")
    }
}

middlewareObj.checkCommentOwnership = (req,res,next)=>{
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err,foundComment)=>{
            if (err || !foundComment){
                req.flash("error", "Error: Comment not found!")
                res.redirect("back")
            } else {
                //does user match cg?
                if(foundComment.author.id.equals(req.user._id)){
                    // console.log(req.params.comment_id)
                    req.comment = foundComment
                    next()
                    // res.render("campgrounds/edit", {campground: foundCampground})
                } else{
                    req.flash("error","I do not know how you got here... However sneaky, you scoundrel, not sneaky enough! You own this comment not!")
                    res.redirect("/ysnp")
                }
            }
        })
    }else{
        req.flash("error","Very very sneaky! However, you own not this comment! In fact, you own nothing! Log in, fool!")
        res.redirect("/ysnp")
    }
}

middlewareObj.isLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    req.flash("error","You need to be logged in to do that.")
    res.redirect("/login")
}

module.exports = middlewareObj