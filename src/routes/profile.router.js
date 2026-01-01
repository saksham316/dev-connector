import { Router } from "express";
import { userAuth } from "../middlewares/auth.middleware.js";

const profileRouter = Router();

// profile
profileRouter.route("/profile").get(userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(500).send("Something went wrong", error);
  }
});;

// edit profile
profileRouter.route("/profile/edit/:userId").patch(async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = req.body;

    const ALLOWED_UPDATES = ["firstName", "photoUrl", "about"];

    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("User updated");
  } catch (error) {
    res.status(500).send("Something went wrong", error.message);
  }
});

export { profileRouter };
