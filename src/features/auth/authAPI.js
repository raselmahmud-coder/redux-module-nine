import { apiSlice } from "../API/APISlice";
import { login } from "./authSlice";

export const authAPI = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
      async onQueryStarted(body, { dispatch, getState, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          localStorage.setItem("auth", JSON.stringify(result.data));
          dispatch(login(result.data));
        } catch (error) {}
      },
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      async onQueryStarted(body, { dispatch, getState, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          localStorage.setItem("auth", JSON.stringify(result.data));
          dispatch(login(result.data));
        } catch (error) {}
      },
    }),
  }),
});
export const { useRegisterMutation, useLoginMutation } = authAPI;
