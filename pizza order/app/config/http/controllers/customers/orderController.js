const Order = require('../../../models/order');
const moment = require('moment'); // use for editing date and time in js

function orderController(){
    return {
        store(req,res){
            // console.log(req.body);

            // validate request

            const {phone ,address} = req.body;
            
            if( !phone || !address ){
                req.flash('error','All fields are required')
                return res.redirect('/cart');
            }

            const order = new Order({
                customerId: req.user._id, // passport ma deserialized method ni help thi aa thai hoo
                items: req.session.cart.items,
                phone: phone,
                address: address,
            })

            order.save().then((result)=>{
                req.flash('success','Order placed successfully');
                delete req.session.cart // order placed thai gaya pachhi cart ne empty karvu pade ok
                return res.redirect('/customer/orders')
            }).catch((err)=>{
                console.log(err);
                req.flash('error','Somthing went wrong');
                return res.redirect('/cart')
            })
        },

        async index(req,res){

            // je order pahela aave te tabel ma nechhe dekhai aatle time fileds ne desending order ma sort kari data display karva tabel ma 
            const orders = await Order.find({customerId: req.user._id},null,{sort: { 'createdAt': -1 }}) // je customer login 6 tena j orders display karva mate aa query aapvi pade

            // console.log(orders); 
            // aahi orders ma Array formet ma data male

            res.header('Cache-Control','no-cache,private, no-store , must-revalidate , max-stale=0 , post-check=0 ,pre-check=0 '); // customer/orders per back jai ne fari aaviye too fari je order-success messages aave te msg fari na aave te mate

            res.render('customers/orders',{orders:orders, moment:moment})

        },
        async show(req,res){
            const order = await Order.findById(req.params.id)

            // Authorize user :- je person no order 6 te j person tenu status joi sake 
            // bija koi person ne tena order ni id khaber padi jai to te id url ma naki tenu status joi na sake bijo person 

            // jeno orders 6 te j tenu status joi sake bijo koi 3rd party tenu status joi na sake

            // aahi check karvu ke je order aapde fetch karine render kariye te order jene login karelu 6 teni 6 ke nahi 

            // aahi order.customerId and req.user._id  ye objects type hoi and 2 obj aapde compir na kari sakai aatle aapde pahela tene string ma convert karva pade 

            if(req.user._id.toString() === order.customerId.toString()){
                // res.render('customers/singleOrder',{ order: order })
                res.render('customers/singleOrder',{ order })
            }
            else{
                res.redirect('/');
            }
        }
    }
}

module.exports = orderController

