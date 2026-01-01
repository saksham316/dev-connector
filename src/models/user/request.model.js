import mongoose from "mongoose";

const connectionReqSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["ignored", "interested", "accepted", "rejected"],
      message: "{VALUE} is not supported",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

connectionReqSchema.index({ fromUserId: 1, toUserId: 1 });

connectionReqSchema.pre("save", function (next) {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
});

export const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionReqSchema,
  "ConnectionRequest"
);
