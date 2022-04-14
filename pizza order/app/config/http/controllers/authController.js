// factory function :- aa aak function 6 je objects return kare

const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
function authController() {

    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }

    return {
        login(req, res) { // its a method fo homeController
            res.render('auth/login')
        },
        post_login(req, res, next) {
            const { email, password } = req.body;
            if (!email || !password) {
                req.flash('error', 'All fields are required ') // aa khali only aa aak req mate j lagu pade becu aahi j define karelu 6 aa
                // aa masg aak req mate j hoi  aapde page refresh kari ye to te messages fari na dekhai
                return res.redirect('/login')
            }

            //
            passport.authenticate('local', (err, user, info) => { // info ma messages male je passport.js file ma define karela 6 te (done method ma je messages 6 te )

                if (err) {
                    req.flash('error', info.message)  // aa info.message ye error key ni value 6 and error te session ma rahela messages key ni value 6
                    return next(err)                // aahi je message 6 te passport.js ma set karel message male
                }
                if (!user) {
                    req.flash('error', info.message)
                    return res.redirect('/login');
                }
                //  koi problem na hoi to
                req.login(user, (err) => {
                    if (err) {
                        req.flash('error', info.message)
                        return next(err)
                    }
                    return res.redirect(_getRedirectUrl(req));
                })

            })(req, res, next)
        },
        register(req, res) {
            res.render('auth/register')
        },
        async post_Register(req, res) {
            const { name, email, password } = req.body;
            // console.log(req.body);

            // Validate request

            if (!name || !email || !password) {
                req.flash('error', 'All fields are required ') // aa khali only aa aak req mate j lagu pade becu aahi j define karelu 6 aa
                // aa masg aak req mate j hoi  aapde page refresh kari ye to te messages fari na dekhai

                // jo aak filed khali hoi add error aave to baki ne feild no data remove na thai form mathi te mate 
                req.flash('name', name);
                req.flash('email', email);

                return res.redirect('/register')
            }

            // Check email is exists or not 

            User.exists({ email: email }, (err, result) => {
                if (result) {
                    req.flash('error', 'Email are already taken plzz use uniqe email');
                    req.flash('name', name);
                    req.flash('email', email);

                    return res.redirect('/register');
                }
            });

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10)


            // create user

            const user = new User({
                // name: name,
                // email: email,  or

                name,
                email,
                password: hashedPassword
            })

            user.save().then((user) => {
                // login
                return res.redirect('/')
            }).catch((err) => {
                req.flash('error', 'Somthing went wrong plzz try leter');
                // console.log(err);
                return res.redirect('/register');
            })

        },
        logout(req, res) {
            req.logout()
            return res.redirect('/login')
        }
    }
}

module.exports = authController;