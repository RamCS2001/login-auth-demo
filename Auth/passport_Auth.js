const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');


module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'username'},(username, password, done)=>{
            //matching user 
            User.findOne({username: username})
                .then(user=>{
                    if(!user){
                        return done(null, false, { message: 'User is not registered' })
                    }
                    //matching the password
                    bcrypt.compare(password, user.password, (err, isMatch)=>{
                        if(err) throw err;

                        if(isMatch){
                            return done(null, user)
                        }
                        else{
                            return done(null, false , {message: 'Incorrect Password'});
                        }
                    })
                })
                .catch(err => console.log(err)) 
        })
    );


    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });
    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>{
            done(null,user);
        });
    });

}