const { check, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

const validateSignUpRequest = [
    check("password")
        .isLength({min:8})
        .withMessage("Password must be atleast 8 characters long."),
];

const isRequestValidated = (req,res,next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json({error: errors.array()[0].msg});
    }
    next();
};

module.exports = {
    validateSignUpRequest,
    isRequestValidated,
};