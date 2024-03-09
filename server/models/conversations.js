import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
  app_id: { type: mongoose.Schema.ObjectId, ref: "Applications" },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Messages" }],
});

const Conversations = mongoose.model("Conversations", conversationSchema);
export default Conversations;
