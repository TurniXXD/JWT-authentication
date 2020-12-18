const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
require('dotenv').config({path:__dirname+'/.env'});

//import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const options = {useNewUrlParser: true, useUnifiedTopology: true};
const uri = process.env.DB_CONNECT;
const db = mongoose.connection;

//Connect to DB
//mongodb+srv://<username>:<password>@ultimatecluster.wb4ba.mongodb.net/<dbname>?retryWrites=true&w=majority
//<username> = admin, <password> = lz7QqsmQCdL52BU2, <dbname> = test
mongoose.connect(uri, options);

db.on('error', (err)=>{
	console.log('>> Failed to connect to MongoDB, retrying...');

	setTimeout( () => {
		mongoose.connect(uri, options);
		},5000);
});

db.once('open',() => {
	console.log("connected to DB");
});

//Middleware
app.use(express.json());
app.get('/', (req, res) => {
	res.send("Hello world!")
})

//Route Middlewares
//everything in authRoute will have this prefix /api/user
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);



app.listen(3011, () => console.log('Server Up and running'));