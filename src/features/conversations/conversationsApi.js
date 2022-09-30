import { io } from "socket.io-client";
import { apiSlice } from "../API/APISlice";
import { messageApi } from "../messages/messagesApi";

export const conversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoints here
    getConversations: builder.query({
      query: ({ email, page = 1 }) =>
        `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=${page}&limit=${process.env.REACT_APP_CONVERSATIONS_PER_PAGE}`,
      transformResponse(apiResponse, meta, arg) {
        const totalCount = meta.response.headers.get("X-Total-Count");
        return {
          conversations: apiResponse,
          totalCount,
        };
      },
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
          socket.on("conversations", (data) => {
            updateCachedData((draft) => {
              const conversation = draft.find(
                (conversation) => +conversation.id === +data.id,
              );
              if (conversation?.id) {
                conversation.message = data.message;
                conversation.timestamp = data.timestamp;
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
        await cacheEntryRemoved;
        socket.close();
      },
    }),
    getMoreConversations: builder.query({
      query: ({ email, page = 1 }) =>
        `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=${page}&limit=${process.env.REACT_APP_CONVERSATIONS_PER_PAGE}`,
      async onQueryStarted({ email, page }, { queryFulfilled, dispatch }) {
        try {
          const conversations = await queryFulfilled;
          if (conversations?.data?.length > 0) {
            /* update messages cache pessimistically start */
            dispatch(
              apiSlice.util.updateQueryData(
                "getConversations",
                { email },
                (draft) => {
                  return {
                    conversations: [...draft.conversations, ...conversations.data],
                    totalCount: +draft.totalCount,
                  };
                },
              ),
            );
            /* update messages cache pessimistically end */
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getConversation: builder.query({
      query: ({ userEmail, participantEmail }) =>
        `/conversations?participants_like=${userEmail}-${participantEmail}&&participants_like=${participantEmail}-${userEmail}`,
    }),
    addConversation: builder.mutation({
      query: ({ sender, data }) => ({
        url: `/conversations`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { dispatch, getState, queryFulfilled }) {
        try {
          const conversation = await queryFulfilled;
          if (conversation?.data?.id) {
            const users = args.data.users;
            const senderUser = users.find((user) => user.email === args.sender);
            // silent entry to messages table / db
            dispatch(
              messageApi.endpoints.addMessage.initiate({
                conversationId: conversation?.data?.id,
                sender: senderUser,
                receiver: users.find((user) => user.email !== args.sender),
                message: args.data.message,
                timestamp: args.data.timestamp,
              }),
            );
          }
        } catch (error) {}
      },
    }),
    editConversation: builder.mutation({
      query: ({ id, sender, data }) =>
        // console.log(sender),
        ({
          url: `/conversations/${id}`,
          method: "PATCH",
          body: data,
        }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        // console.log(args.sender, "args is here");
        /* optimistic cache update start*/
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            "getConversations",
            { email: args.sender },
            (draft) => {
              const draftConversation = draft.conversations.find(
                (con) => con.id.toString() === args.id.toString(),
              );
              draftConversation.message = args.data.message;
              draftConversation.timestamp = args.data.timestamp;
              return draft;
            },
          ),
        );
        /* optimistic cache update end*/
        try {
          const conversation = await queryFulfilled;
          if (conversation?.data?.id) {
            const users = args.data.users;
            const senderUser = users.find((user) => user.email === args.sender);
            // silent entry to messages table / db
            const res = await dispatch(
              messageApi.endpoints.addMessage.initiate({
                conversationId: conversation?.data.id,
                sender: senderUser,
                receiver: users.find((user) => user.email !== args.sender),
                message: args.data.message,
                timestamp: args.data.timestamp,
              }),
            ).unwrap();
            // console.log(res, "res is here");
            /* update messages cache pessimistically start */
            dispatch(
              apiSlice.util.updateQueryData(
                "getMessages",
                { id: res.conversationId.toString() },
                (draft) => {
                  draft.push(res);
                },
              ),
            );
            /* update messages cache pessimistically end */
          }
        } catch (error) {
          console.log(error);
          patchResult.undo();
          /* optimistic cache update end*/
        }
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = conversationApi;
