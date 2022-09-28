import { apiSlice } from "../API/APISlice";
import { io } from "socket.io-client";

export const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoints here
    getMessages: builder.query({
      query: ({ id, page = 1 }) =>
        `/messages?conversationId=${id}&_sort=timestamp&_order=desc&_page=${page}&limit=${process.env.REACT_APP_MESSAGES_PER_PAGE}`,
      async onCacheEntryAdded(
        arg,
        { cacheDataLoaded, updateCachedData, cacheEntryRemoved },
      ) {
        // create a listener for the socket
        const socket = io(`${process.env.REACT_APP_API_URL}`, {
          reconnectionDelay: 1000,
          reconnection: true,
          reconnectionAttempts: 10,
          transports: ["websocket"],
          agent: false,
          upgrade: false,
          rejectUnauthorized: false,
        });
        try {
          await cacheDataLoaded;
          socket.on("messages", (data) => {
            console.log("message", data);
            updateCachedData((draft) => {
              const message = draft.find((m) => {
                // console.log(m.conversationId, data.conversationId);
                return m.conversationId.toString() === data.conversationId.toString();
              });
              if (message?.conversationId) {
                message.message = data.message;
                message.timestamp = data.timestamp;
                console.log(message,"from if");
              } else {
                // for assignment task
                // add the new conversation
                // draft.unshift(data);
              }
            });
          });
        } catch (error) {
          console.log(error);
        }
      },
    }),
    addMessage: builder.mutation({
      query: (body) => ({
        url: `/messages`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetMessagesQuery, useAddMessageMutation } = messageApi;
