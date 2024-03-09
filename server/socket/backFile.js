// import express from "express";
// import http from "http";
// import mongoose from "mongoose";
// import { Server } from "socket.io";
// import Messages from "../models/messages.js";
// import Users from "../models/userModel.js";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// // -------------- HANDLE SOCKET CONNECTION ----------------- //

// // Listen for client connection
// io.on("connection", async (socket) => {
//   const userId = socket.handshake.query["userId"];

//   // console.log(`USER CONNECTED ${socket.id}`);
//   // FIND AND UPDATE USER WITH SOCKET ID AND STATUS TTO ONLINE
//   if (userId != null && Boolean(userId)) {
//     try {
//       const u = await Users.findByIdAndUpdate(
//         userId,
//         {
//           socket_id: socket.id,
//           status: "Online",
//         },
//         { new: true }
//       );
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   socket.on("get_direct_messages", async ({ userId }, callback) => {
//     const id = new mongoose.Types.ObjectId(userId);

//     const existing_messages = await Messages.find({
//       participants: { $all: [id] },
//     })
//       .populate("participants")
//       .populate("participants", "name profileUrl _id email status -password")
//       .populate({
//         path: "app_id",
//         select: "user status",
//         populate: {
//           path: "job",
//           select: "jobTitle",
//         },
//       });

//     callback(existing_messages);
//   });

//   socket.on("start_chatting", async (data) => {
//     const { to: msgTo, from: msgFrom, app_id: appid } = data;

//     const to = new mongoose.Types.ObjectId(msgTo);
//     const from = new mongoose.Types.ObjectId(msgFrom);
//     const app_id = new mongoose.Types.ObjectId(appid);

//     const existing_messages = await Messages.find({
//       participants: { $size: 2, $all: [to, from] },
//       app_id,
//     }).populate("participants", "name _id email status -password");

//     if (existing_messages.length === 0) {
//       let new_chat = await Messages.create({
//         participants: [from, to],
//         app_id,
//       });

//       new_chat = await Messages.findById(new_chat).populate("participants");

//       socket.emit("start_chat", new_chat);
//     } else {
//       socket.emit("start_chat", existing_messages[0]);
//     }
//   });

//   socket.on("get_messages", async (data, callback) => {
//     try {
//       const { messages } = await Messages.findById(data.chat_id).select(
//         "messages"
//       );
//       callback(messages);
//     } catch (error) {
//       console.log(error);
//     }
//   });

//   // Handle incoming text messages
//   socket.on("text_message", async (data) => {
//     const { message, chat_id, from, to, type } = data;

//     const to_user = await Users.findById(to);
//     const from_user = await Users.findById(from);

//     const new_message = {
//       to: to,
//       from: from,
//       type: type,
//       created_at: Date.now(),
//       text: message,
//     };

//     const chat = await Messages.findById(chat_id);
//     chat.messages.push(new_message);

//     await chat.save({ new: true, validateModifiedOnly: true });

//     io.to(to_user?.socket_id).emit("new_message", {
//       chat_id: chat_id._id,
//       message: new_message,
//     });

//     io.to(from_user?.socket_id).emit("new_message", {
//       chat_id,
//       message: new_message,
//     });
//   });

//   // unread messages
//   socket.on("get_unread_messages", async (data) => {
//     const to_user = mongoose.Types.ObjectId(data?.userId);
//     const chat_id = mongoose.Types.ObjectId(data?.chat_id);

//     const total = await Messages.find({
//       chat_id: chat_id,
//     });
//   });

//   // -------------- HANDLE SOCKET DISCONNECTION ----------------- //
//   socket.on("end", async (data) => {
//     if (data?.userId) {
//       const id = new mongoose.Types.ObjectId(data?.userId);

//       await Users.findByIdAndUpdate(id, { status: "Offline" });
//     }

//     console.log("closing connection");
//     socket.disconnect(0);
//   });
// });

// export { app, io, server };
