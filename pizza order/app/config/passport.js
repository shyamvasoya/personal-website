const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user');
const bcrypt = require('bcrypt')

function init(passport) {
    // usernameField :- mins aapde user name su rakhavanu 6 (uniq vastu kai 6 database ma ke je no username tarike use kari sakai)
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => { // email and password login form ma nakho te aahi male

        // Login code

        // console.log(email);
        // console.log(password);

        // check  if email exists or not'
        const user = await User.findOne({ email: email })
        if (!user) {
            return done(null, false, { message: 'No user with this email' })
        }

        bcrypt.compare(password, user.password)
            .then(match => {
                if (match) {
                    return done(null, user, { message: 'Logged in Successfully' }) // 2nd perameter user male to user nahiter false (aahi match thai 6 aatle user male)
                }
                return done(null, false, { message: 'Wrong username or Password' })
            }).catch(err => {
                return done(null, false, { message: 'Somthing went wrong' })
            })

    }));



    passport.serializeUser((user, done) => { // login thaya pachhi sesstion ma su store karvu 6 te naki karva mate
        done(null, user._id) // mins je user login thai teni id sesstion ma store thai jai
    });

    passport.deserializeUser((id, done) => { // session ne aander je store karu hoi te aahi mali jai aapane aa method ni help thi
        User.findById(id, (err, user) => {
            done(err, user)
        })

        // deserializeUser ma user lakelu 6 teni help thi 
        // tame (req.user) lakhi ne je user loggedin hoi te melavi sako so aa mate aa method aahi lakheli 6
    })
}

module.exports = init;