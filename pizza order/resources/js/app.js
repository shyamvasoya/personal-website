
let addToCart = document.querySelectorAll('.add-to-class') // its a array fo all button becues of querySelectorAll
import axios from 'axios';
import Noty from 'noty';
let cartCounter = document.querySelector('.cartCounter');
import initAdmin from './admin'
import moment from 'moment'


function updateCart(pizza) {

    axios.post('/update-cart', pizza)
        .then(res => {  // cartController mathi je req aave te aahi male
            // console.log(res);
            // console.log(res.data); // cartContoller mathi je res male te aahi male
            cartCounter.innerText = res.data.totalQty;

            // for notifications
            new Noty({
                type: 'success',
                timeout: 1000,
                text: 'Items added to cart',
                // progressBar: false, // timeout progressbar na joi ye to
                // layout : ''bottomLeft, // notification ni position set karva mate
            }).show();
        })
        .catch(err => {
            new Noty({
                type: 'error',
                timeout: 1000,
                text: 'Somthing went wrong plzz try again'
            }).show();
        })

}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        // console.log(e);

        // btn ma data attribute 6 teni help thi batha pizza aahi male 6
        let pizza = JSON.parse(btn.dataset.pizza)     // je button per click karo teno data je pizza name thi male 6 te aani pizaa name na variyabal ma save thai jase pen te string form ma hase tene obj ma convert karvo pade tethi aanhi string parse karvi pade 

        updateCart(pizza) // btn per click thaya pachhi cart ma pizza add kari cart update karvu 6 so aa method call akri 6 aahi

    })
})


// remove alert messages which present in the order page afert x secounds

const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}

// render admin order tabel

initAdmin()


///  change perticuler order status  *****************************************

let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput ? hiddenInput.value : null;

let statuses = document.querySelectorAll('.status_line');
// console.log(statuses);

order = JSON.parse(order)
// console.log(order);

let time = document.createElement('small');


function updateStatus(order) {
    let stapCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status;
        if (stapCompleted) {
            status.classList.add('step-completed')
        }
        if (dataProp === order.status) {
            stapCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A');
            status.appendChild(time)
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current');
            }
        }
    })
}

updateStatus(order);

// socket cilent side work *****************************************

// let socket = io()  // socket ne aahi use karva mate layout.ejs ma scoket script add kavi pade 

// //  join socket server with perticuler order page and mack uniqe rooms for every orders

// if(order){
//     socket.emit('join', `order_${order._id}`)
// }

// socket.on('orderUpdated',(data)=>{
//     const updatedOrder = {...order}  // juno order copy keryo
//     updatedOrder.updatedAt = moment().format() // currnt time update thai ne aavi jai
//     updatedOrder.status = data.status

//     console.log(data);
// })


