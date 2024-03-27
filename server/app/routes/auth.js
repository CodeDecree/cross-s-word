const express = require("express");
const router = express.Router();

const { signUp, signIn, logOut, boardData } = require("../controller/auth");
const authenticateToken = require("../middleware/authenticate");

router.route("/signin").post(signIn);

router.route("/signup").post(signUp);

router.route("/validate-token").get(authenticateToken);

router.route("/logout").get(logOut);

router.route("/getBoard").get(boardData);
 

module.exports = router;