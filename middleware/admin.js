const jwt = require("jsonwebtoken");
const secretKey  =require("../config");

// Middleware for handling auth
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB.
    const token = req.headers.authorization;
    const words = token.split(" ");//we are doing this because header has bearer token, and we need just token
    const jwtToken = words[1];

    const decodedValue = jwt.verify(jwtToken, secretKey);

    if(decodedValue.username){
        next();
    }else{
        res.status(403).json({
            msg: "you are not authenticated"
        })
    }
}

module.exports = adminMiddleware;