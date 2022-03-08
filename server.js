const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const { ensureAuthenticated } = require('/Auth/auth');
const app = express();

//passort 
require('Auth/passport_Auth')(passport);

//DB
const User = require('../SL using EJS/models/User');
const bm = require('../SL using EJS/models/bestmanager');
const sd = require('../SL using EJS/models/solodance');
const event = require('./models/events');


mongoose.connect('mongodb+srv://ramkumar:Qwertyuiop@cluster0.kvsrl.mongodb.net/restapi?retryWrites=true&w=majority');
const db = mongoose.connection;
db.on('error',(error)=> console.log("Error in connecting to database"));
db.once('open',()=> console.log("Connected to database"))



app.set("views-engine","ejs");
app.use(express.urlencoded({ extended: false})); //body praser

//express-session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

//passport 
app.use(passport.initialize());
app.use(passport.session());

//Connect-flash
app.use(flash());

app.use((req,res, next)=>{
    res.locals.success= req.flash('success');
    res.locals.error= req.flash('error');
    next();
});
app.get('/', (req,res)=>{
    res.render("index.ejs");
});

app.get('/login', (req,res)=>{
    res.render("login.ejs");
});

app.get('/register', (req,res)=>{
    res.render("register.ejs");
});

app.get('/bestmanager', ensureAuthenticated,(req,res)=>{
    res.render("bestmanager.ejs");
});

app.get('/solodance', ensureAuthenticated,(req,res)=>{
    res.render("solodance.ejs");
});

app.post('/register', (req,res)=>{
    const {username , password , Cpassword} = req.body;
    console.log(username);
    console.log(password);
    console.log(Cpassword);
    let errors = [];

    // validation 
    if( !username || !password || !Cpassword ){
        errors.push({msg: 'Fill all the fields'});
    }
    if(password != Cpassword){
        errors.push({msg: "Passwords doesn't match"})
    }

    if(errors.length >0 ){
        res.render('register.ejs', {
            errors,
            username,
            password,
            Cpassword
        });
    }
    else{
        User.findOne({username: username})
        .then(user=> {
            if(user){
                //user exist
                errors.push({msg: "Username already taken"});
                res.render('register.ejs', {
                    errors,
                    username,
                    password,
                    Cpassword
                });
            }
            else{
                const newUser = new User({
                    username,
                    password
                });
                //hash password
                bcrypt.genSalt(10,(err,salt)=> 
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        //password hased
                        newUser.password = hash;
                        //save user
                        newUser.save()
                            .then(user=>{
                                req.flash('success', 'You are now registered and can log in')
                                res.redirect('/login');
                                console.log("Account Created")
                            })
                            .catch(err => console.log(err))
                    }));
            }
        });
    }
});

app.post('/bestmanager',(req,res)=>{
    const {name, mail} = req.body;
    console.log(name);
    console.log(mail);
    const newPart = new bm({
        name,
        mail
    })
    const eventName = "best manger";
    const newEvent = new event({
        name,
        eventName
    })
    newEvent.save()
        .then(user=>{
            console.log("Event done");
        })
    newPart.save()
        .then(user=>{
            req.flash('success', 'You are now registered')
            res.redirect('/yourevents')
        })
});

app.post('/solodance',(req,res)=>{
    const {name, mail} = req.body;
    console.log(name);
    console.log(mail);
    const newPart = new sd({
        name,
        mail
    })
    const eventName = "solo dance";
    const newEvent = new event({
        name,
        eventName
    })
    newEvent.save()
        .then(user=>{
            console.log("Event done");
        })
    newPart.save()
        .then(user=>{
            req.flash('success', 'You are now registered')
            res.redirect('/yourevents')
        })
});

//login
app.post('/login',(req,res,next)=>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req,res,next);
});

app.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard.ejs',{user: req.user.username});
});

app.get('/yourevents',ensureAuthenticated,(req,res)=>{
    const name = req.user.username;
    const eventsReg = [];
    event.find().where("name", name)
        .exec((err,doc)=>{
            doc.reverse();
            //console.log(doc.length);
            for (let i = 0; i < doc.length; i++) {
                eventsReg.push(doc[i].eventName);
            }
            console.log(eventsReg);
        })
        res.render('yourevents.ejs',{name,eventsReg});
});

app.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('success', 'you are logged out');
    res.redirect('/login');
});

const port = process.env.PORT || 5000;
app.listen(port,()=>{ console.log("Server @ ",port)});