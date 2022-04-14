
const homeController = require('../app/http/controllers/homeController');// aahi aapan ne fectory function resived thai je object resives kare
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const guest = require('../app/http/middleware/guest');
const orderController = require('../app/http/controllers/customers/orderController');
const AdminOrderController = require('../app/http/controllers/admin/orderController');
const login_req = require('../app/http/middleware/login_req');
const admin = require('../app/http/middleware/admin');
const statusController = require('../app/http/controllers/admin/statusController');


function initRoutes(app) {

    // app.get('/',(req,res)=>{
    //     res.render('home')
    // });

    // (req,res)=>{ // its anonumuies function 2nd arguments of all routes methods
    //     res.render('home')
    // }

    app.get('/', homeController().index);

    app.get('/login', guest, authController().login);
    app.post('/login', authController().post_login);

    app.get('/register', guest, authController().register);
    app.post('/register', authController().post_Register);

    app.get('/cart', cartController().index_cart);
    app.post('/update-cart', cartController().update);

    app.post('/logout', authController().logout);

    // Customer routes

    app.post('/orders', login_req, orderController().store);
    app.get('/customer/orders', login_req, orderController().index)
    app.get('/customer/orders/:id', login_req, orderController().show)

    // Admin routes
    app.get('/admin/orders', admin, AdminOrderController().index)
    app.post('/admin/order/status', admin, statusController().update)
}

module.exports = initRoutes