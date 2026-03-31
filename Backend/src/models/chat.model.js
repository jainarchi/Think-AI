import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user is required to create a chat"],
    },
    title: {
      type: String,
      trim: true,
      default: "New chat",
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  },
);

const chatModel = mongoose.model("chat", chatSchema);
export default chatModel;
