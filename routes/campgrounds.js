const   express     = require("express"),
        router      = express.Router(),
        Campground  = require("../models/campgrounds"),
        middleware  = require("../middleware")

//INDEX - show all campgrounds
router.get("/", (req,res) => {
    Campground.find({}, (err,allCampgrounds)=>{
        if (err) {
            console.log(err)
        }
        else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds})
        }
    })
})

// CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, async (req,res) =>{
    createdCampground = await Campground.create(req.body.newCampground)
    createdCampground.author.id = req.user._id
    createdCampground.author.username = req.user.username
    createdCampground.save()
    res.redirect(`/campgrounds/${createdCampground._id}`)
})

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, (req,res)=> res.render("campgrounds/new"))

//SHOW - shows more info about one campground
router.get("/:id", (req,res)=>{
    Campground.findById(req.params.id).populate("comments").exec((err,foundCampground)=>{
        if(err || !foundCampground){
            req.flash("error", "Error: Campground not found!")
            res.redirect("/campgrounds")
        }else{
            res.render("campgrounds/show", {campground: foundCampground})
        }
    })
})

// EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req,res)=>{
    res.render("campgrounds/edit", {campground: req.campground})
})

// UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, (req,res)=>{
    req.campground.name = req.body.campground.name
    req.campground.image = req.body.campground.image
    req.campground.description = req.body.campground.description
    req.campground.price = req.body.campground.price
    req.campground.save()
    res.redirect(`/campgrounds/${req.params.id}`)
})

// DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, (req,res)=>{
    req.campground.remove()
    res.redirect("/campgrounds")
})


module.exports = router