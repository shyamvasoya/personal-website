// jo user logged hoi to url ma /login type kari ne login page ke ragister page per jai na sake te mate 
// jo login hoi and javani try kare to home page per redirect kare 

function guest(req, res, next) {
    if (!req.isAuthenticated()) { // jo  user login na hoi to te /login and /register route access kari sake
        return next()
    }
    return res.redirect('/'); // jo user loggedin hoi to te /login and /register route access kari sake te '/' per redireact thai jai
}

module.exports = guest;