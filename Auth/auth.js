module.exports= {
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error' , 'please Login to view the resource requested');
        res.redirect('/login');
    }
}