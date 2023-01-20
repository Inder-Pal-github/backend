const { UserModel } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    if (name && email && password && username) {
      const prevUser = await UserModel.findOne({
        $and: [{ username }, { email }],
      });

      if (!prevUser) {
        const hashedPassword = await bcrypt.hashSync(password, 8);
        const newUser = new UserModel({
          name,
          username,
          email,
          password: hashedPassword,
        });
        await newUser.save();
        res
          .status(201)
          .json({ message: "New user added successfully.", success: true });
      } else {
        res.status(401).json({ message: "User already exists." });
      }
    } else {
      res.status(404).json({ message: "Please enter all the fields!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, error: true });
  }
};

const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({ message: "Please enter all fields!" });
    }
    // checking if user exist or not.
    const isUserPresent = await UserModel.findOne({
      $and: [{ username }, { email }],
    });

    if (!isUserPresent) {
      return res
        .status(401)
        .json({ message: "No user present, please signup first!" });
    }
    // password checking.
    const checkPassword = await bcrypt.compareSync(
      password,
      isUserPresent.password
    );

    if (!checkPassword) {
      return res.status(401).json({ message: "Wrong credentials" });
    }
    // generating token.
    const token = await jwt.sign(
      { email: isUserPresent.email, userId: isUserPresent._id },
      process.env.JWT_SECRET_KEY,{expiresIn:'1h'}
    );
    if (!token) {
      return res
        .status(500)
        .json({ message: "Something went wrong, try again later." });
    }
    res
      .status(200)
      .json({ message: "Login successful", token, email: isUserPresent.email });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

module.exports = { signup, login };
