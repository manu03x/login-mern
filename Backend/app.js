const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/user-routes.js');
const cookieParser = require('cookie-parser');
const cors = require('cors')
require('dotenv').config();


const app = express();

app.use(cors({credentials: true, origin: "http://localhost:3000"}))
app.use(cookieParser())
app.use(express.json());
app.use('/api', router);

mongoose
    .connect(`mongodb+srv://manu:${process.env.MONGODB_PASSWORD}@cluster0.kpfe8m2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    
    .then(() => {
        app.listen(5000);
        console.log("Database");
    }) 
    
    .catch((err) => {
        console.log(err);
    })
