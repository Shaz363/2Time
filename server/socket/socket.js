import express from "express";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import Messages from "../models/messages.js";
import Users from "../models/userModel.js";
import Conversations from "../models/conversations.js";

const app = express();
const server = http.createServer(app);
// http://localhost:3000
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// -------------- HANDLE SOCKET CONNECTION ----------------- //

// Listen for client connection
io.on("connection", async (socket) => {
  const userId = socket.handshake.query["userId"];

  console.log(`USER CONNECTED ${socket.id}`);
  // FIND AND UPDATE USER WITH SOCKET ID AND STATUS TTO ONLINE
  if (userId != null && Boolean(userId)) {
    try {
      const u = await Users.findByIdAndUpdate(
        userId,
        {
          socket_id: socket.id,
          status: "Online",
        },
        { new: true }
      );

      try {
        const id = new mongoose.Types.ObjectId(userId);

        const unReadCount = await Messages.countDocuments({
          to: userId,
          isRead: false,
        });

        io.to(u?.socket_id).emit("unread_message", {
          _id: u._id,
          total: unReadCount,
        });
      } catch (error) {
        console.log(error);
      }
    } catch (e) {
      console.log(e);
    }
  }

  socket.on("get_direct_messages", async ({ userId }, callback) => {
    try {
      const id = new mongoose.Types.ObjectId(userId);

      const existing_conversation = await Conversations.find({
        participants: { $all: [id] },
      })
        .populate("participants", "name profileUrl _id email status -password")
        .populate({
          path: "app_id",
          select: "user status",
          populate: {
            path: "job",
            select: "jobTitle",
          },
        })
        .populate({
          path: "messages",
          select: "chat_id text created_at",
          options: { sort: { _id: -1 }, limit: 1 },
        });

      const result = await Messages.aggregate([
        {
          $match: {
            to: id,
            isRead: false,
          },
        },
        {
          $group: {
            _id: "$chat_id",
            unreadCount: { $sum: 1 },
          },
        },
      ]);

      callback({ conversations: existing_conversation, unread: result });
    } catch (error) {
      console.log("An error occurred: ", error);
      callback([]);
    }
  });

  socket.on("start_chatting", async (data) => {
    const { to: msgTo, from: msgFrom, app_id: appid } = data;

    const to = new mongoose.Types.ObjectId(msgTo);
    const from = new mongoose.Types.ObjectId(msgFrom);
    const app_id = new mongoose.Types.ObjectId(appid);

    const existing_messages = await Conversations.find({
      participants: { $size: 2, $all: [to, from] },
      app_id,
    }).populate("participants", "name email status -password");

    if (existing_messages.length === 0) {
      let new_chat = await Conversations.create({
        participants: [from, to],
        app_id,
      });

      new_chat = await Conversations.findById(new_chat._id).populate(
        "participants",
        "name email status -password"
      );

      socket.emit("start_chat", new_chat);
    } else {
      socket.emit("start_chat", existing_messages[0]);
    }
  });

  socket.on("get_messages", async (data, callback) => {
    try {
      const { chat_id, userId } = data;
      await Messages.updateMany({ chat_id, to: userId }, { isRead: true });
      const messages = await Messages.find({ chat_id });

      callback(messages);
    } catch (error) {
      console.log(error);
      callback([]);
    }
  });

  // Handle incoming text messages
  socket.on("text_message", async (data) => {
    const { message, chat_id, from, to, type } = data;

    const to_user = await Users.findById(to);
    const from_user = await Users.findById(from);

    const new_message = {
      chat_id,
      to,
      from,
      type,
      created_at: Date.now(),
      text: message,
    };

    const newChat = await Messages.create(new_message);

    const chat = await Conversations.findById(chat_id);
    chat.messages.push(newChat._id);

    await chat.save({ new: true, validateModifiedOnly: true });

    io.to(to_user?.socket_id).emit("new_message", {
      chat_id: chat._id,
      message: newChat,
    });

    io.to(from_user?.socket_id).emit("new_message", {
      chat_id: chat._id,
      message: new_message,
    });
  });

  // unread messages
  socket.on("get_unread_messages", async (data) => {
    try {
      const userId = new mongoose.Types.ObjectId(data?.userId);

      const user = await Users.findById(userId);

      const unReadCount = await Messages.countDocuments({
        to: userId,
        isRead: false,
      });

      io.to(user?.socket_id).emit("unread_message", {
        _id: user._id,
        total: unReadCount,
      });
    } catch (error) {
      console.log(error);
    }
  });

  // -------------- HANDLE SOCKET DISCONNECTION ----------------- //
  socket.on("end", async (data) => {
    if (data?.userId) {
      const id = new mongoose.Types.ObjectId(data?.userId);

      await Users.findByIdAndUpdate(id, { status: "Offline" });
    }

    console.log("closing connection");
    socket.disconnect(0);
  });
});

export { app, io, server };
