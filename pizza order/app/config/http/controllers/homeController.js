// factory function :- aa aak function 6 je objects return kare

const Menu = require('../../models/menu');

function homeController(){
    return {
        //     // its a one ways to fatch a data using promisss

        // index(req,res) { // its a method fo homeController
        //     // Menu.find().then((pizzas)=>{  // "/" route per get request maro to data male
        //     //     res.render('home',{pizzas:pizzas})
        //     //     // console.log(pizzas);
        //     // }).catch((err)=>{
        //     //     console.log(err)
        //     // })
        // }

        // fetch a data using async await

        async index(req,res) { // its a method of homeController            
            const pizzas = await Menu.find()
            res.render('home',{pizzas:pizzas}) //pizzas is a array of all pizza
        }

    }
}

module.exports = homeController;