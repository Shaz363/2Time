import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
  chat_id: { type: mongoose.Schema.ObjectId, ref: "Conversations" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  from: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  type: {
    type: String,
    enum: ["Text", "Media", "Document", "Link"],
    default: "Text",
  },
  created_at: { type: Date, default: Date.now() },
  text: { type: String },
  isRead: { type: Boolean, default: false },
});

const Messages = mongoose.model("Messages", messagesSchema);
export default Messages;
