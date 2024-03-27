require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

authenticateToken = async (req,res) => {

    const token = req.cookies.token;

    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err,user) => {
        if(err) return res.sendStatus(403);
        res.status(StatusCodes.OK).json({user, message: "Valid Token!"});
    });
}

module.exports = authenticateToken;
