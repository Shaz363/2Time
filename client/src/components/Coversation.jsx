import React, { useEffect, useRef, useState } from "react";
import { BsSendFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "sonner";
import { FetchCurrentMessages } from "../redux/chatSlice";
import { socket } from "../socket";
import { IoMdArrowBack } from "react-icons/io";

export const Avatar = ({ el }) => {
  return (
    <div className='w-10 h-10 rounded-full relative'>
      <img
        src={el?.img}
        alt={el?.name}
        className='relative w-10 h-10 rounded-full object-cover'
      />
      {el?.online && (
        <div className='w-3 h-3 rounded absolute bottom-0 right-0 bg-green-500' />
      )}
    </div>
  );
};

const Conversation = ({ setIsViewChat }) => {
  const messagesEndRef = useRef(null);
  const { user } = useSelector((state) => state.user);
  const { direct_chat, chat_room_id } = useSelector((state) => state.messages);
  const [msg, setMsg] = useState("");

  const dispatch = useDispatch();

  const { current_messages, current_conversation: current } = direct_chat;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (msg.length < 1) {
      toast.error("Enter chat message");
      return;
    }

    socket.emit("text_message", {
      message: msg,
      chat_id: chat_room_id,
      from: user._id,
      to: current.userId,
      type: "Text",
    });

    setMsg("");
  };

  useEffect(() => {
    socket?.emit(
      "get_messages",
      { chat_id: current._id, userId: user._id },
      (data) => {
        dispatch(FetchCurrentMessages({ messages: data }));
      }
    );
  }, [current._id, current_messages]);

  useEffect(() => {
    messagesEndRef.current.scrollTop = messagesEndRef?.current?.scrollHeight;
  }, [current_messages]);

  const ChatCard = ({ chat }) => {
    const isSender = chat?.sender;

    const info = isSender
      ? { img: user?.profileUrl, name: user.name }
      : current;

    const alignmentClass = isSender ? "justify-end" : "justify-start";

    const bgColor = isSender ? "bg-gray-200" : "bg-black";
    const txtColor = isSender ? "text-black" : "text-white";

    return (
      <div className={`flex gap-2 ${alignmentClass}`}>
        <Avatar el={info} />
        <div
          className={`flex flex-col gap-2 rounded-lg ${bgColor} ${txtColor} p-2 px-3 max-w-md `}
        >
          <p className={`${txtColor} font-bold`}>{info?.name}</p>
          <span
            className={`text-sm ${isSender ? "text-black" : "text-gray-200"}`}
          >
            {chat?.message}
          </span>
          <span
            className={`text-[12px] text-right ${
              isSender ? "text-black" : "text-gray-300"
            }`}
          >
            {chat?.dateTime}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className='flex flex-col h-full w-full flex-1 px-4 md:px-8 '>
      <div className='flex items-center justify-between shadow-md'>
        <div className='flex gap-3 items-center'>
          <Avatar el={current} />
          <div className=''>
            <span className='text-base font-semibold line-clamp-1'>
              {current.name}
            </span>
            <span className='text-sm text-blue-600 font-semibold'>
              {current.online ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsViewChat(false)}
          className='block md:hidden '
        >
          <IoMdArrowBack />
        </button>
      </div>

      {/* Chat box */}

      <div
        ref={messagesEndRef}
        className='flex-1 w-full h-[100vh] overflow-y-auto py-4 px-4 md:px-8 bg-white space-y-8'
      >
        {current_messages?.map((chat, index) => (
          <ChatCard chat={chat} key={index} />
        ))}
      </div>

      <div className='p-4'>
        <form
          onSubmit={handleSendMessage}
          className='flex gap-2 items-center border border-gray-300 rounded-full w-full h-14 p-1'
        >
          <input
            type='text'
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className='w-full h-full outline-none'
            placeholder='Start chatting....'
            multiple={true}
          />
          <button className='mr-4'>
            <BsSendFill size={24} color='blue' />
          </button>
        </form>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default Conversation;
