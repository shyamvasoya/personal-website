function login_req(req,res,next){
    if(req.isAuthenticated()){ // jo user login hoi to j home page and cart page and bija routes acces kari sake te mate 
        return next()
    }
    return res.redirect('/login'); 
}

module.exports = login_req;