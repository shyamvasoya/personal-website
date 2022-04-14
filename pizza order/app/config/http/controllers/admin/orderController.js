const Order = require('../../../models/order')
function AdminOrderController(){
    return {

        index(req,res){
            // completed orders na batavana hoi admin ne aatle 

            // populate('cutomerId')  :- aani help thi je order fetch karo tema je customer ni id hoi te customer ni bathi details mali jai 
            // mins customerId ni value ma jene te orders aap yo hoi te user ni details aavi jai
            // -password :- aapde user details ma password filed nathi joite aatle aam lakhavu pade
            Order.find({ status: { $ne: 'completed' } },null,{sort: { 'createdAt': -1 }})
            .populate('customerId','-password').exec((err,orders)=>{
                if(req.xhr){ // axios ma data ajex call ni help thi data mokalva mate
                    return res.json(orders) // axios mate json res joiye 
                }
                else{
                    return res.render('admin/orders') // koi page refresh kare tayre data page per render karva mate 
                }
            })
        }

    }
}

module.exports = AdminOrderController;