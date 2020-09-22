const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts')

dotenv.config();

//mongoose deprecation warnings fix
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

//Connect to DB
//mongodb+srv://<username>:<password>@ultimatecluster.wb4ba.mongodb.net/<dbname>?retryWrites=true&w=majority
//<username> = admin, <password> = lz7QqsmQCdL52BU2, <dbname> = test
mongoose.connect(
	process.env.DB_CONNECT, 
	() => console.log('connect to DB')
);

//Middleware
app.use(express.json());

//Route Middlewares
//everything in authRoute will have this prefix /api/user
app.use('/api/user', authRoute);
app.use('api/posts', postRoute);


app.listen(3033, () => console.log('Server Up and running'));