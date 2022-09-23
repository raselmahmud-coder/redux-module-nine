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
      query: ({sender, data}) => ({
        url: `/conversations`,
        method: "POST",
        body:data,
      }),
      async onQueryStarted(args, { dispatch, getState, queryFulfilled }) {
        try {
          const conversation = await queryFulfilled;
          if (conversation?.id) {
            const users = args.data.users;
            // const senderUser = users.find((user) => user.email === sender);
            // silent entry to messages table / db
            dispatch(
              messageApi.endpoints.addMessage.initiate({
                email: args.users[0].email,
              }),
            );
          }
        } catch (error) {}
      },
    }),
    editConversation: builder.mutation({
      query: ({ body, id }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = conversationApi;
