const express = require('express');
const app = express();
const port = 80;


app.listen(port , function(err){
    if(err)
    console.log(`Error in connecting to server: ${err}`);

    console.log(`Connected to the port, ${port}`);
});