const express = require('express');
const app = express();
const port = 6;
// setting up express layout for layouts 
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

// setting up assets as your static folder
app.use(express.static('./assets'));

// extract style and scripts from sub pages into layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// using express Routes  
app.use('/', require('./routes'));

// set up view engine
app.set('view engine' , 'ejs');
app.set('views', './views');

app.listen(port , function(err){
    if(err)
    console.log(`Error in connecting to server: ${err}`);

    console.log(`Connected to the port, ${port}`);
});