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
        console.log(getState, "onQueryStarted", body);
        try {
          const result = await queryFulfilled;
          console.log(result, "onQueryStarted");
          localStorage.setItem("auth", JSON.stringify(result.data));
          dispatch(login(result.data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
      async onQueryStarted(body, { dispatch, getState, queryFulfilled }) {
        console.log(getState, "onQueryStarted", body);
        try {
          const result = await queryFulfilled;
          console.log(result, "onQueryStarted");
          localStorage.setItem("auth", JSON.stringify(result.data));
          dispatch(login(result.data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});
export const { useRegisterMutation, useLoginMutation } = authAPI;
