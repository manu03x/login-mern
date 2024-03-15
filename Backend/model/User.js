const moongose = require("mongoose")

const Schema = moongose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password:{
        type: String,
        required: true,
        minLength: 6
    },

    status: {
        type: Number,
        required: true,
    },

    role: {
        type: String,
        required: false
    }

})

module.exports= moongose.model('User', userSchema)