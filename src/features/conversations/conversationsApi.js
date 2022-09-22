import { apiSlice } from "../API/APISlice";

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
      query: (body) => ({
        url: `/conversations`,
        method: "POST",
        body,
      }),
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
