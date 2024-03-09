import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import chatSlice from "./chatSlice";

const rootReducer = combineReducers({
  user: userSlice,
  messages: chatSlice,
});

export { rootReducer };
