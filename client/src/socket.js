import io from "socket.io-client";

let socket;
// const URI = "https://ali-jobfinder.onrender.com/";
const URI = "http://localhost:8800/";
const connectSocket = ({ userId, kind }) => {
  socket = io(URI, {
    query: `userId=${userId}&kind=${kind}`,
  });
};
export { socket, connectSocket };
