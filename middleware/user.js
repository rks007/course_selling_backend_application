const jwt = require('jsonwebtoken');
const secretKey = require("../config")

function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB.
    const token = req.headers.authorization;
    const words = token.split(" ");
    const jwtToken = words[1];

    const decodedValue = jwt.verify(jwtToken, secretKey);

    if(decodedValue.username){
        req.username = decodedValue.username;//imp concept: passing this value to the next function from one middleware to another
        next();
    }else{
        res.status(403).json({
            msg: "you are not authenticated"
        })
    }
}

module.exports = userMiddleware;