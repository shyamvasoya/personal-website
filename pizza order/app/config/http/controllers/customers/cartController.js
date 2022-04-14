// factory function :- aa aak function 6 je objects return kare

function cartController() {
    return {
        index_cart(req, res) {
            // aahi sesstion ni help thi card get kari ne pan frant end ma add-to-cart page ma data disply kari sakai
            res.render('customers/cart');
        },
        update(req, res) {

            // formet of cart to be store in session

            // let cart = {
            //     items:{
            //         _Id: {item: pizzaobj , qty:0}
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }

            if (!req.session.cart) { // for the first time creating cart and set as a empty cart mins session ma cart na hoi to create karo
                req.session.cart = {
                    items: {}, // its obj
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart
            // console.log(req.body); //  je pizza per click karo te aahi male

            if (!cart.items[req.body._id]) // aapde je pizza add karvo 6 te cart ma na hoi to aa karo
            {
                // cart.items[req.body._id] its key
                // value of above key
                // {  
                //     item: req.body,
                //     qty: 1
                // }
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                },
                    cart.totalQty = cart.totalQty + 1,
                    cart.totalPrice = cart.totalPrice + req.body.price
            }
            else { // je pizza aapde add karvo hoi te alredy cart ma hoi to aa karvu
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
                cart.totalQty = cart.totalQty + 1
                cart.totalPrice = cart.totalPrice + req.body.price
            }
            return res.json({ totalQty: req.session.cart.totalQty })
        }
    }
}

module.exports = cartController;
