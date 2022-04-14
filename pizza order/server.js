require('dotenv').config()
const express = require("express");
const app = express();
const ejs = require('ejs');
const path = require('path')
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash'); // session ma kaam karva mmate aani jarur pade
const MongoDb_Session_store = require('connect-mongo')(session); // for store sesstion in data base (M = capital mins that its store class or method)
const PORT = process.env.PORT || 3000
const Emitter = require('events');


// database connections
const url = process.env.URL;
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("database connected");
}).catch(err => {
    console.log('Connection failed');
});

app.use(express.json()); // req.body melava mate (aahi aapde body-parser no pan use kari sakai pan aahi aa lakho to body parser no use karvani jarur nahi)
app.use(express.urlencoded({ // encoded data req.body ma leva mate (form data , user info)
    extended: false
}))

// sessinn store

let mongoStore = new MongoDb_Session_store({
    mongooseConnection: connection,
    collection: 'sessions' // this collections crested in db for session store
})


// // event emitter :- server side event emit kari te event server side biji koi file ma exicute karva mate aano use thai
// // event emit and event exicute aa bane aalag aalag file ma karvanu hoi too temna comunicationes mate aa use thai 
// const eventEmitter = new Emitter()
// app.set('eventEmitter',eventEmitter); // app ma koi pan file ma req obj sathe eventEmitter use karva mate

// session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // cookies exp time in mili seconds (// 24 hr 6 aa time )
}));

// authiantication : - passport config (session na config pachhi j aa passport nu config karvu)
const passport = require('passport'); // for authiantications
const passportInit = require('./app/config/passport');
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash()); // error mesg session ni help thi clint side mokal va mate (sesstion ma error store kare or (messages store kare))

// *******
// globel middelware (// session and login user ne html page ma as variabel access karva mate (imp))
app.use((req, res, next) => {
    // ejs or html templetes ma session key aavalabel karvamate by defultes te avalabel na hoi html ma so aa middelware use karvo (seesion.cart mathi totalQty layout.ejs ma batava matae)
    res.locals.session = req.session;

    // ejs or html templetes ma kayo user logged in 6 te and ejs ma user melava mate aa use kar u 6
    res.locals.user = req.user // deserializeUser method je passport ma 6 tenathi aa male(req.user)
    next();
})

// set templete engine 
app.use(expressLayout); // batha page ma same hoi aavi vastu ne hende karva mate (tamplates inharitanes)
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs')

// routes
require('./routes/web')(app) // becues its return function 

// Assets
app.use(express.static('public')) //layout page ma je css and js file add kari te public folder ni 6 tethi currect path male te mate static define kar u

const server = app.listen(PORT, () => {
    console.log(`Server started on ${PORT} ok`)
});


// socket work start hear **********************************************

// const io = require('socket.io')(server)

// io.on('connection',()=>{
//     // join clinet hear 
//     // console.log(socket.id); // batah socket ni uniqe id  genrate thai (note :- aa order ni id nathi)

//     socket.on('join',(orderId)=>{  // orderId:- perticuler order nu uniqe room name
//         // console.log(orderId);
//         socket.join(orderId) // orderId name ni room create thai and aapde join thai jaiye 
//         // orderId = order_${order._id}
//     })
// })

// eventEmitter.on('orderUpdated',(data)=>{
//     // io.to ni help thi je order nu status update thai te j order na room ma aa event exicute thai
//     io.to(`order_${data.id}`).emit('orderUpdated',data) // kaya perticuler order room ma aa event exicute karvi 6 te aahi aapvu pade
//     // io.to ma je orderUpdated event emit kari te client side ma exicute karvi
// })