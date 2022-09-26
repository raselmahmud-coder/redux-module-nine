import { apiSlice } from "../API/APISlice";
import { messageApi } from "../messages/messagesApi";

export const conversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoints here
    getConversations: builder.query({
      query: ({ email, page = 1 }) =>
        `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=${page}&limit=${process.env.REACT_APP_CONVERSATIONS_PER_PAGE}`,
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
        console.log(args.sender, "args is here");
        /* optimistic cache update start*/
        const patchResult1 = dispatch(
          apiSlice.util.updateQueryData(
            "getConversations",
            { email: args.sender },
            (draft) => {
              console.log("draftConversation" + draft);
              const draftConversation = draft.find((con) => con.id == args.id);
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
            dispatch(
              messageApi.endpoints.addMessage.initiate({
                conversationId: conversation?.data.id,
                sender: senderUser,
                receiver: users.find((user) => user.email !== args.sender),
                message: args.data.message,
                timestamp: args.data.timestamp,
              }),
            );
          }
        } catch (error) {
          console.log(error);
          /* optimistic cache update start*/
          patchResult1.undo();
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
