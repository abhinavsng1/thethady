var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    session = require("express-session"),
    
    methodOverride = require("method-override"),
    cookieParser = require('cookie-parser'),
    multer=require("multer"),
    upload=multer({dest:"./uploads"});

   
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    userRoutes = require("./routes/users"),
    indexRoutes      = require("./routes/index")
    
mongoose.connect("mongodb+srv://:tByFCoryPd4nZSf1@cluster0-yebob.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true,useCreateIndex:true, useUnifiedTopology: true });




app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + '/'));

app.use(methodOverride('_method'));
app.use(cookieParser('secret'));



// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "We don't share secrets here",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


app.use("/", indexRoutes);
app.use("/users", userRoutes);
app.use("/users/1/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The  Server Has Started!");
});

