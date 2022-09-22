import { apiSlice } from "../API/APISlice";

export const usersAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoints here
    getUser: builder.query({
      query: ({ email }) => `/users?email=${email}`,
    }),
  }),
});

export const { useGetUserQuery } = usersAPI;
