const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/user-routes.js');
const productsRouter = require('./routes/product-routes.js');
const cookieParser = require('cookie-parser');
const cors = require('cors')
require('dotenv').config();


const app = express();

const corsOptions = {
    origin: '*', // Reemplaza con el origen correcto de tu aplicación cliente
    credentials: true, // Permite el envío de cookies y otros datos de autenticación
    methods:"GET,POST,PUT"
  };
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json());
app.use('/api', router);
app.use('/api/products', productsRouter);

mongoose
    .connect(`mongodb+srv://manu:${process.env.MONGODB_PASSWORD}@cluster0.kpfe8m2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    
    .then(() => {
        app.listen(5000);
        console.log("Database");
    }) 
    
    .catch((err) => {
        console.log(err);
    })
