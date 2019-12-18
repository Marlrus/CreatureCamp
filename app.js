//===================================================
//PREVIOUS: VERSION 13 DYNAMIC PRICE FEATURE
    //13.0  CHANGING DB TO ADD PRICE FEATURE, CHANGING MODEL FOR CAMPGROUNDS, CHANGING TEMPLATES AND ROUTES THAT INVOLVE CAMPGROUND PRICES
//CURRENT:  VERSION 14 DEPLOY ON HEROKU VERSION
    //14.1 DOTENV ADDED / HEROKU LOCALVARS ADDED / GIT EXCLUDE ADDED
//===================================================

const   express         = require("express"),
        app             = express(),
        bodyParser      = require("body-parser"),
        bodyParserUse   = bodyParser.urlencoded({extended: true}),
        mongoose        = require("mongoose"),
        flash           = require("connect-flash"),
        passport        = require("passport"),
        LocalStrategy   = require("passport-local"),
        User            = require("./models/user"),
        methodOverride  = require("method-override")
 
//ROUTE REQUIRING
const   commentRoutes   = require("./routes/comments"),
        campgroundRoutes= require("./routes/campgrounds"),
        indexRoutes     = require("./routes/index")

//DOTENV CONFIG        
require('dotenv').config()

// mongoose.connect(process.env.DB_LOCAL, {
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() =>{
    console.log(`Mongoose Connected to: ${mongoose.connection.name}`)
}).catch(err =>{
    console.log(`ERROR: ${err.message}`)
})


//===================================
//MIDDLEWARE
//===================================

app.use(bodyParserUse)
app.set("view engine", "ejs")

app.use(express.static(`${__dirname}/public`))
app.use(methodOverride("_method"))
app.use(flash())

//PASSPORT CONFIG
app.use(require("express-session")({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})

//ROUTE FILES + DEFAULT ROUTE TEXT
app.use("/", indexRoutes)
app.use("/campgrounds/:id/comments",commentRoutes)
app.use("/campgrounds", campgroundRoutes)

const port = process.env.PORT;

app.listen(port, ()=> console.log(`CreatureCamp server Has Started! in: ${port}`));