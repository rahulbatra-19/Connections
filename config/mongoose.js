// require the libarary
const mongoose = require('mongoose');

// Error handling

main().catch(err => console.log('Error connecting to db', err));


// connect to database 
async function main()
{
    await mongoose.connect(`mongodb://localhost/connections_db`);
}

// acquire the connection (to check if it is successfull)
const db = mongoose.connection;

db.once('open', function()
{
    console.log('Successfully connected to the database:: MongoDB');
});

module.exports = db;