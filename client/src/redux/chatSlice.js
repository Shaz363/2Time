import { createSlice } from "@reduxjs/toolkit";
import { formatDateTime } from "../utils";

const user = JSON.parse(window?.localStorage.getItem("userInfo"));
const userId = user?._id;

const initialState = {
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
  chat_room_id: null,
  unReadCount: 0,
};

const slice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    fetchDirectMessages(state, action) {
      const { conversations, unread } = action.payload;

      const list = conversations.map((el) => {
        const user = el.participants.find(
          (elm) => elm._id.toString() !== userId
        );
        const lastMsg = el?.messages[0];

        const unreadMsg = unread?.find((un) => un?._id?.toString() === el._id);

        return {
          _id: el._id,
          userId: user?._id,
          name: user?.name,
          online: user?.status === "Online",
          img: user?.profileUrl,
          msg: lastMsg?.text || "",
          time: !lastMsg ? "" : formatDateTime(new Date(lastMsg?.created_at)),
          unread: unreadMsg?.unreadCount || 0,
          jobTitle: el?.app_id?.job?.jobTitle,
        };
      });

      state.direct_chat.conversations = list;
    },
    addDirectMessages(state, action) {
      const this_conversation = action.payload.conversation;

      const user = this_conversation.participants.find(
        (elm) => elm._id.toString() !== userId
      );

      state.direct_chat.conversations = state.direct_chat.conversations.filter(
        (el) => el?._id !== this_conversation._id
      );
      // const lastMsg = el?.messages?.slice(-1)[0];
      const lastMsg = el?.messages[0];

      state.direct_chat.conversations.push({
        _id: this_conversation._id,
        userId: user?._id,
        name: user?.name,
        online: user?.status === "Online",
        img: user?.profileUrl,
        msg: lastMsg?.text || "",
        time: !lastMsg ? "" : formatDateTime(new Date(lastMsg?.created_at)),
        unread: 0,
        jobTitle: el?.app_id?.job?.jobTitle,
      });
    },
    updateDirectMessages(state, action) {
      const this_conversation = action.payload.conversation;

      state.direct_chat.conversations = state.direct_chat.conversations.map(
        (el) => {
          if (el?._id !== this_conversation._id) {
            return el;
          } else {
            const user = this_conversation.participants.find(
              (elm) => elm._id.toString() !== userId
            );

            const lastMsg = el?.messages[0];

            return {
              _id: this_conversation._id,
              userId: user?._id,
              name: user?.name,
              online: user?.status === "Online",
              img: user?.profileUrl,
              msg: lastMsg?.text || "",
              time: !lastMsg
                ? ""
                : formatDateTime(new Date(lastMsg?.created_at)),
              unread: 0,
              jobTitle: this_conversation?.app_id?.job?.jobTitle,
            };
          }
        }
      );
    },

    setCurrentConversation(state, action) {
      state.direct_chat.current_conversation = action.payload;
    },

    fetchCurrentMessages(state, action) {
      const messages = action.payload.messages;
      const formatted_messages = messages.map((el) => ({
        _id: el._id,
        type: el?.type,
        message: el.text,
        sender: el.from === user._id,
        receiver: el.to === user._id,
        dateTime: formatDateTime(new Date(el?.created_at)),
      }));
      state.direct_chat.current_messages = formatted_messages;
    },

    addDirectMessage(state, action) {
      state.direct_chat.current_messages.push(action.payload.message);

      // update last message

      const lastmsg = action.payload.message;

      state.direct_chat.conversations = state.direct_chat.conversations.map(
        (el) => {
          if (el?._id !== lastmsg._id) {
            return el;
          } else {
            return {
              ...el,
              msg: lastmsg?.message,
              time: lastmsg?.dateTime,
            };
          }
        }
      );
    },

    setChatRoomId(state, action) {
      state.chat_room_id = action.payload.id;
    },

    setUnReadCount(state, action) {
      state.unReadCount = action.payload.total;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const FetchDirectMessages = (conversations) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchDirectMessages(conversations));
  };
};

export const AddDirectMessages = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectMessages({ conversation }));
  };
};

export const UpdateDirectMessages = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateDirectMessages({ conversation }));
  };
};

export const FetchCurrentMessages = ({ messages }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchCurrentMessages({ messages }));
  };
};

export const AddDirectMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectMessage({ message }));
  };
};

export const AddChatRoomID = (el) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setCurrentConversation(el));
    dispatch(slice.actions.setChatRoomId({ id: el._id }));
  };
};

export const SetUnReadCount = (val) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setUnReadCount({ total: val?.total }));
  };
};
