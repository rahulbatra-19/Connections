const express = require('express');
const app = express();
const port = 6;



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