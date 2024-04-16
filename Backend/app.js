const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/user-routes.js');
const productsRouter = require('./routes/product-routes.js');
const cookieParser = require('cookie-parser');
const cors = require('cors')
require('dotenv').config();


const app = express();

const corsOptions = {
    origin: 'http://localhost:3000, https://main--ecommerceseguro.netlify.app', // Reemplaza con el origen correcto de tu aplicación cliente
    credentials: true,
    optionSuccessStatus:200 // Permite el envío de cookies y otros datos de autenticación
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
