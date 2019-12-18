const   express     = require("express"),
        router      = express.Router(),
        passport    = require("passport"),
        User        = require("../models/user"),
        middlware   = require("../middleware")


//Root route
router.get("/", (req,res) => res.render("landing")) 

//Show register form
router.get("/register", (req,res)=>{
    res.render("register")
})

router.post("/register", (req,res)=>{
    let newUser = new User({username: req.body.username})
    User.register(newUser,req.body.password, (err,user)=>{
        if (err){
            req.flash("error", `Error: "${err.message}"`)
            return res.redirect("/register")
        }
        passport.authenticate("local")(req,res,()=>{
            req.flash("success",`Welcome to Creature Camp ${user.username}! Waddle safely!`)
            res.redirect("/campgrounds")
        })
    })
})

//Login Form
router.get("/login", (req,res)=>{
    res.render("login")
})

//Login logic
router.post("/login", passport.authenticate("local", 
    //CUSTOM CALLBACK? LOOK AT PASSPORT AUTHENTICATION FOR MESSAGES ON EJS TEMPLATE
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),(req,res)=>{
})

//log out

router.get("/logout", middlware.isLoggedIn, (req,res)=>{
    req.flash("success", `Logged out! See you again soon ${req.user.username}!`)
    req.logout()
    res.redirect("/campgrounds")
})

//YSNP
router.get("/ysnp", (req,res)=>{
    res.render("ysnp")
})


module.exports = router