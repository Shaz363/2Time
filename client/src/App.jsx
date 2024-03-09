import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Footer, Navbar } from "./components";
import {
  About,
  ApplyHistory,
  AuthPage,
  Companies,
  CompanyProfile,
  FindJobs,
  JobDetail,
  MessagesPage,
  UploadJob,
  UserProfile,
} from "./pages";
import {
  AddDirectMessage,
  AddDirectMessages,
  FetchDirectMessages,
  SetUnReadCount,
  UpdateDirectMessages,
} from "./redux/chatSlice";
import { connectSocket, socket } from "./socket";
import { formatDateTime } from "./utils";

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to='/user-auth' state={{ from: location }} replace />
  );
}

function App() {
  const { user } = useSelector((state) => state.user);
  const { current_conversation: current, conversations } = useSelector(
    (state) => state.messages.direct_chat
  );
  const [isNew, setIsNew] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket && user?._id) {
      connectSocket({ userId: user?._id });
    }

    socket?.on("new_message", (data) => {
      socket.emit(`get_direct_messages`, { userId: user._id }, (data) => {
        dispatch(FetchDirectMessages(data));
      });

      socket?.emit("get_unread_messages", { userId: user?._id });

      if (current?._id === data.chat_id) {
        dispatch(
          AddDirectMessage({
            _id: data.chat_id,
            type: message?.type,
            message: message?.text,
            sender: message?.from === user._id,
            receiver: message?.to === user._id,
            dateTime: formatDateTime(new Date(message?.created_at)),
          })
        );
      }
    });

    socket?.on("start_chat", (data) => {
      const existConversation = conversations.find(
        (el) => el?._id === data._id
      );

      if (existConversation) {
        dispatch(UpdateDirectMessages({ conversation: data }));
      } else {
        dispatch(AddDirectMessages({ conversation: data }));
      }
    });

    socket?.on("unread_message", (data) => {
      dispatch(SetUnReadCount(data));
    });

    return () => {
      socket?.off("new_message");
      socket?.off("start_chat");
      socket?.off("unread_message");
    };
  }, [user, socket]);

  return (
    <main className='bg-[#f7fdfd]'>
      <Navbar />

      <Routes>
        <Route element={<Layout />}>
          <Route
            path='/'
            element={<Navigate to='/find-jobs' replace={true} />}
          />
          <Route path='/find-jobs' element={<FindJobs />} />
          <Route path='/companies' element={<Companies />} />
          <Route path={"/user-profile/:id?"} element={<UserProfile />} />

          <Route path={"/company-profile/:id?"} element={<CompanyProfile />} />
          <Route path={"/upload-job"} element={<UploadJob />} />
          <Route path={"/job-detail/:id"} element={<JobDetail />} />
          <Route path={"/applications"} element={<ApplyHistory />} />
          <Route path={"/direct-chats"} element={<MessagesPage />} />
        </Route>

        <Route path='/about-us' element={<About />} />
        <Route path='/user-auth' element={<AuthPage />} />
      </Routes>
      {user && window.location.pathname !== "/direct-chats" && <Footer />}
    </main>
  );
}

export default App;
