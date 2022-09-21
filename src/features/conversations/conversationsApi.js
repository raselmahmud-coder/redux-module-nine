import { apiSlice } from "../API/APISlice";

export const conversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoints here
    getConversations: builder.query({
      query: ({ email, page = 1 }) =>
        `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=${page}&limit=${process.env.REACT_APP_CONVERSATIONS_PER_PAGE}`,
    }),
  }),
});

export const { useGetConversationsQuery } = conversationApi;
