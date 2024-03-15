const { checkIfUserExists } = require('../utils/utils');
const User = require('../model/User');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


const signup = async (req,res,next) => {
    const {name, email , password} = req.body
    
    const userExists = await checkIfUserExists(email);
    if (password.length < 6) {
        return res.status(400).json({ message: "Use a long password" });
    }
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    let status = 0;

    const hashedPassword = bcrypt.hashSync(password, 12);

    const user = new User({
        name,
        email,
        password: hashedPassword,
        status
    })

    try {
        await user.save();

    } catch (err) {
        return new Error(err)
    }

    return res.status(201).json({message:user})
}


const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const userExists = await checkIfUserExists(email);
        if (!userExists) {
            return res.status(400).json({ message: "User not found. Please sign up." });
        }

        const existingUser = await User.findOne({ email: email });
        if (!existingUser.status) {
            return res.status(401).json({ message: "Usuario Inactivo" });
        }

        const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid Email / Password" });
        }

        const token = jwt.sign({ id: existingUser._id, role: existingUser.role}, process.env.JWT_SECRET_KEY, { expiresIn: "30s" });

        console.log("GENERATED TOKEN\n", token)
        res.cookie("authToken", token, {        
            path: '/',
            expires: new Date(Date.now() + 1000 * 30),
            httpOnly: true,
            sameSite: "lax"
        });

        return res.status(200).json({ 
            message: 'Successfully Logged In', 
            user: {
                id: existingUser._id,
                email: existingUser.email,
                role: existingUser?.role || 'user'
            }, 
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// const verifyToken = (req, res, next) => {
//     const cookies = req.headers.cookie;
//     console.log(req.headers)
//     const token = cookies.split("=")[1];

//     if(!token) {
//         return res.status(404).json({message: "No token found"})        
//     }

//     jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err,user) => {
//         if(err) {
//             return res.status(400).json({message: "Invalid Token"})
//         }

//         console.log(user.id)
//         req.id = user.id
//         req.role = user.role
//     })
//     next();
// }

    const getUser = async (req , res , next) => {
        const userId = req.id;
        let user;
        try {
            user = await User.findById(userId, "-password")
        } catch(err) {
            return new Error(err)
        }

        if(!user) {
            return res.status(404).json({message:"User Not Found"})
        }

        return res.status(200).json({user})
    }

    const isAdmin = (req, res, next) => {
        if (req.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ message: 'Access Forbidden. Only admin users can access this resource.' });
        }
    };

    const refreshToken = (req, res, next) => {
        const refreshToken = req.cookies.authToken;
    
        if (!refreshToken) {
            return res.status(400).json({ message: "Couldnt find refresh token" });
        }
    
        jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(403).json({ message: "Refresh token invalid" });
            }
    
            // Generar un nuevo token de acceso
            const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "30s" });
    
            // Establecer el nuevo token de acceso en una cookie
            res.cookie("authToken", accessToken, {
                path: '/',
                expires: new Date(Date.now() + 1000 * 30),
                httpOnly: true,
                sameSite: "lax"
            });
    
            // Continuar con la solicitud
            req.id = user.id;
            req.role = user.role;
            next();
        });
    };
    

    const toggleUserStatus = async (req, res, next) => {
        const userIdToToggle = req.params.userId;
    
        try {
            const userToToggle = await User.findById(userIdToToggle);
            if (!userToToggle) {
                return res.status(404).json({ message: "User not found." });
            }
    
            // Cambiar el estado del usuario
            userToToggle.status = userToToggle.status === 1 ? 0 : 1;
            await userToToggle.save();
    
            const statusMessage = userToToggle.status === 1 ? "enabled" : "disabled";
            return res.status(200).json({ message: `User ${statusMessage} successfully.` });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    };
    
    // Función para crear nuevos administradores
    const createAdmin = async (req, res, next) => {
        const { email } = req.body;
        // console.log(req.body)
        try {
            const existingUser = await User.findOne({ email: email });
            if (!existingUser) {
                return res.status(404).json({ message: "User not found." });
            }
    
            existingUser.role = 'admin'; // Asignar rol de administrador al usuario existente
            await existingUser.save();
    
            return res.status(200).json({ message: "User promoted to admin successfully." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    };
    
    const verifyToken = (req, res, next) => {
        const authToken = req.cookies.authToken;
        console.log("VERIFIED TOKEN \n", authToken)
    
        if (!authToken) {
            return res.status(404).json({ message: "No token found" });
        }
    
        jwt.verify(authToken, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ message: "Invalid Token" });
            }
    
            req.id = user.id;
            req.role = user.role;
            next();
        });
    };
    
    
    const logout = (req, res, next) => {
        const authToken = req.cookies.authToken;
    
        if (!authToken) {
            return res.status(400).json({ message: "Couldnt find token" });
        }
    
        jwt.verify(authToken, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(403).json({ message: "Authentication failed" });
            }
    
            res.clearCookie("authToken");
    
            return res.status(200).json({ message: "Successfully logged out" });
        });
    };
    

    const getAllUsers = async (req, res, next) => {
        try {
            const users = await User.find({}, '-password'); // Excluimos el campo de contraseña
            res.status(200).json({ users });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
    

module.exports = {
    signup,
    login,
    verifyToken,
    getUser,
    isAdmin,
    toggleUserStatus,
    createAdmin,
    refreshToken,
    logout,
    getAllUsers
};