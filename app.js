var express = require("express");
	 app = express(),
	 bodyParser = require("body-parser"),
	 mongoose = require("mongoose"),
	 flash = require("connect-flash"),
	 passport = require("passport"),
	 LocalStrategy = require("passport-local"),
	 methodOverride = require("method-override"),
	 Campground = require("./models/campground"),
	 Comment = require("./models/comment"),
	 User = require("./models/user"),
     seedDB = require("./seeds")

// requring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	authRoutes = require("./routes/auth")

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seed the database
// seedDB();

// Passport Configuration
app.use(require("express-session")({
	secret: "Once again Funtik is the best cat in the world",
	resave :false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});

