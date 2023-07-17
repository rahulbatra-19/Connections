const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 6;
const db = require('./config/mongoose');
// setting up express layout for layouts 
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
// used for session cookie
const session = require('express-session'); 
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');
// setting up assets as your static folder

// for flash messsages
const flash  = require('connect-flash');
const customMware = require('./config/middleware');

app.use(express.static('./assets'));




// extract style and scripts from sub pages into layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




// set up view engine
app.set('view engine' , 'ejs');
app.set('views', './views');

app.use(session({
    name: 'connections',
    secret: 'secketKey',
    saveUninitialized : false,
    resave: false,
    cookie : {
        maxAge : (1000*60*100)
    },
    store: MongoStore.create({
        mongoUrl : 'mongodb://localhost/connections_db',
        autoRemove : 'disabled'
    },
    function (err) {
        console.log(err || 'connect-mongoDB setup');
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(customMware.setFlash);


app.use(passport.setAuthenticatedUser);


// make the uploads path available to the browser
app.use('/uploads',express.static(__dirname + '/uploads'));

// using express Routes  
app.use('/', require('./routes'));

app.listen(port , function(err){
    if(err)
    console.log(`Error in connecting to server: ${err}`);

    console.log(`Connected to the port, ${port}`);
});