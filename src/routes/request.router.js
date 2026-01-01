import { Router } from "express";
import { userAuth } from "../middlewares/auth.middleware.js";
import { ConnectionRequest } from "../models/user/request.model.js";

const requestRouter = Router();

// send
requestRouter
  .route("/request/send/:status/:toUserId")
  .post(userAuth, async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid Status Type",
        });
      }

      // if connection already exists
      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnection) {
        return res.status(400).json({
          message: "Already Connected",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.status(200).json({
        message: "Connection Request Sent Successfully",
        data,
      });
    } catch (error) {
      res.status(500).send("Something went wrong", error);
    }
  });

// review
requestRouter
  .route("/request/review/:status/:requestId")
  .post(userAuth, async (req, res) => {
    try {
      const loggedInUser = req.user;
      const status = req.params.status;
      const requestId = req.params.requestId;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Status not allowed");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).send("Request not found");
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.status(200).json({
        message: `User ${status} the request`,
        data,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        message: "Something went wrong",
        error: error,
      });
    }
  });

export { requestRouter };
