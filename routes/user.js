const {Router} = require("express");
const { signup, login } = require("../controllers/user");

const userRouter = Router();

userRouter.post("/register",signup)
userRouter.post("/login",login);

module.exports = {userRouter};