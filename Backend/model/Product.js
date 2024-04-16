const moongose = require("mongoose")

const Schema = moongose.Schema;

const productsSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    price: {
        type: String,
        required: true,
        unique: true,
    },

    stock: {
        type: Number,
        required: true,
    },

})

module.exports= moongose.model('Product', productsSchema)