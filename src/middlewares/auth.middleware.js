import { User } from "../models/user/user.model.js";
import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    // read token
    const { token } = req.cookies;

    // validate token
    const decodedJwt = jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodedJwt;

    // find user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(400).send("Error" + error);
  }
};

export { userAuth };
