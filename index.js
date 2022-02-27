const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb');
const req = require("express/lib/request");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { use } = require("passport");



const app = express();
const port = process.env.PORT || 3000;


app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(session({
    secret:"carrer guidance.",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

// mongodb atlas connection
const dbUrl = "mongodb+srv://sundar:bgvLQywmJuNCH9Yu@user.6h3lw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


mongoose.connect(dbUrl,{useNewUrlParser: true,useUnifiedTopology: true},function(err){
    if(err){
        console.log(err);
    }else{
        console.log("db successfully connected");
    }
});
  

const userSchema =  new mongoose.Schema({
   username: String,
   password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login", function(req,res){
    const user = new User({
        username:req.body.username,
        password: req.body.password
    });

    req.login(user,function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/home");
            });
        }
    });
    
    
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    User.register({username: req.body.username}, req.body.password, function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");

        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/first");
            });
        }
    });
   
});

app.get("/home",function(req,res){
    if(req.isAuthenticated()){
        res.render("index");
    }else{
        res.redirect("/login");
    }
    
});

app.get("/first",function(req,res){
    res.render("index");
});

app.get("/courses", function(req,res){
      res.render("courses");

});

app.get("/jobs", function(req,res){
    res.render("jobs");

});

app.get("/internship", function(req,res){
    res.render("internship");

});

app.get("/hackathons", function(req,res){
    res.render("hackathon");

});

app.get("/logout",function(req, res, next){
    req.logout();
    res.redirect("/");
})

app.listen (port , function(){
    console.log("server stared on " + port);
});
