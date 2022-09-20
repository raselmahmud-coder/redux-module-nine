import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/API/APISlice";
import authSlice from "../features/auth/authSlice";
import conversationsSlice from "../features/conversations/conversationsSlice";
import messagesSlice from "../features/messages/messagesSlice";

console.log(process.env.NODE_ENV !== "production");

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
    conversations: conversationsSlice,
    messages: messagesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});
