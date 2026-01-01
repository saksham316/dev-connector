import { Router } from "express";
import { User } from "../models/user/user.model.js";
import { validateSignupData } from "../utils/validation.utils.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authRouter = Router();

// login
authRouter.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid User");
    }

    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(password, passwordHash);
    if (isPasswordValid) {
      // create a jwt token
      const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET);

      // add token to the cookies
      res.cookie("token", token);

      res.json({
        success: true,
        message: "Login Successful",
      });
    } else {
      throw new Error("Invalid Password");
    }
  } catch (error) {
    res.status(500).send("Something went wrong", error);
  }
});

// signup
authRouter.route("/signup").post(async (req, res) => {
  try {
    // validate body
    validateSignupData(req);

    const { firstName, lastName, email, password } = req.body;

    // encrypt password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    await user.save();
    res.send("user added");
  } catch (error) {
    res.status(500).send("Something went wrong: " + error.toString());
  }
});

//logout
authRouter.route("/logout").post((req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logged out successfully");
});

export { authRouter };
