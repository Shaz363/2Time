import React, { useEffect, useState } from "react";
import { BsWechat } from "react-icons/bs";
import { IoMdRefresh } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Conversation } from "../components";
import { Avatar } from "../components/Coversation";
import { AddChatRoomID, FetchDirectMessages } from "../redux/chatSlice";
import { socket } from "../socket";

const MessagesPage = () => {
  const { user } = useSelector((state) => state.user);
  const { direct_chat, chat_room_id } = useSelector((state) => state.messages);
  const dispatch = useDispatch();
  const { conversations } = direct_chat;
  const [isViewChat, setIsViewChat] = useState(false);

  const handleSelectChat = (el) => {
    dispatch(AddChatRoomID(el));
    setIsViewChat(true);
  };
  const handleLoadChat = () => {
    socket?.emit(`get_direct_messages`, { userId: user._id }, (data) => {
      dispatch(FetchDirectMessages(data));
    });
  };

  useEffect(() => {
    handleLoadChat();
  }, [socket, user._id]);

  return (
    <div className='container h-[calc(100vh-100px)] mx-auto flex gap-6 2xl:gap-10 md:px-5 py-0 md:py-6 bg-[#f7fdfd]'>
      <div
        className={`w-full md:w-1/3 bg-white p-4 shadow rounded-md ${
          isViewChat ? "hidden md:block" : "block"
        }`}
      >
        <div className='w-full '>
          <div className='flex items-center justify-between mb-5'>
            <p className='text-lg font-semibold text-gray-500'>
              All Chats ({conversations?.length})
            </p>
            <button onClick={handleLoadChat}>
              <IoMdRefresh />
            </button>
          </div>

          <div className='space-y-2'>
            {conversations?.map((el) => (
              <div
                key={el?._id}
                className={`w-full flex gap-2 border-b border-gray-200 pb-2 hover:bg-gray-100 cursor-pointer p-1 rounded ${
                  chat_room_id === el._id && "bg-gray-200"
                }`}
                onClick={() => handleSelectChat(el)}
              >
                <Avatar el={el} />
                <div className='flex flex-col flex-1'>
                  <p className='text-gray-500 text-base line-clamp-1'>
                    {el?.jobTitle}
                  </p>
                  <span className='text-base font-semibold line-clamp-1'>
                    {el.name}
                  </span>
                  <span className='line-clamp-1 text-sm text-gray-600'>
                    {el.msg}
                  </span>
                </div>
                <div className='flex  flex-col items-center justify-center'>
                  {el?.unread > 0 && (
                    <div className='w-5 h-5 bg-blue-600 flex text-white items-center justify-center rounded-full text-xs'>
                      {el.unread}
                    </div>
                  )}
                  <span>{el.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`w-full md:w-2/3 flex flex-col p-0 md:p-4 bg-white shadow rounded-md ${
          !isViewChat ? "hidden md:block" : "block"
        }`}
      >
        {chat_room_id ? (
          <Conversation setIsViewChat={setIsViewChat} />
        ) : (
          <div className='w-full h-full flex flex-col gap-2 items-center justify-center'>
            <BsWechat className='text-8xl text-gray-500' />
            <p className='text-3xl font-semibold text-gray-500'>
              Start Conversation
            </p>
            <span className='text-sm'>Select Chat to start chatting</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
