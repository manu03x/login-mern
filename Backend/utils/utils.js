const User = require('../model/User');// Asegúrate de importar el modelo User aquí

async function checkIfUserExists(email) {
    try {
        const existingUser = await User.findOne({ email: email });
        return existingUser ? true : false;
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = {
    checkIfUserExists
};
