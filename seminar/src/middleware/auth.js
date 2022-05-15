const AccountModel = require("../models/account");

const authMiddleware = async (req, res, next) => {
    const { credential, password } = req.body;
    const login = await AccountModel.find({_username: credential, _password: password});
    
    if (login != null) {
        console.log("[AUTH-MIDDLEWARE] Authorized User");
        next();
    }
    else { 
        console.log("[AUTH-MIDDLEWARE] Not Authorized User");
        res.status(401).json({ error: "Not Authorized" });
    }
}

module.exports = authMiddleware;
