import { useEffect, useState } from "react";
import { useGetUserQuery } from "../../features/users/usersAPI";
import isValidEmail from "../ui/isValidEmail";
import Error from "../../components/ui/Error";
import { useDispatch, useSelector } from "react-redux";
import {
  conversationApi,
  useAddConversationMutation,
  useEditConversationMutation,
} from "../../features/conversations/conversationsApi";

export default function Modal({ open, control }) {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [userCheck, setUserCheck] = useState(false);
  const {
    isLoading,
    data: participant,
    error,
  } = useGetUserQuery({ email: to }, { skip: !userCheck });
  const { user: loggedInUser } = useSelector((state) => state.auth || {});
  const { email: loggedInEmail } = loggedInUser || {};
  const [conversation, setConversation] = useState(undefined);
  const dispatch = useDispatch();
  const [addConversation, { isSuccess: addConSuccess }] =
    useAddConversationMutation();
  const [editConversation, { isSuccess: editConSuccess }] =
    useEditConversationMutation();
  useEffect(() => {
    if (addConSuccess || editConSuccess) {
      control();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addConSuccess, editConSuccess]);

  useEffect(() => {
    if (
      participant &&
      participant?.length > 0 &&
      participant?.[0]?.email !== loggedInEmail
    ) {
      // check if user exists
      dispatch(
        conversationApi.endpoints.getConversation.initiate({
          userEmail: loggedInEmail,
          participantEmail: participant?.[0]?.email,
        }),
      )
        .unwrap()
        .then((data) => {
          setConversation(data);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedInEmail, participant, dispatch]);

  const debounceHandler = (fn, timer) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn(...args);
      }, timer);
    };
  };
  const doSearch = (e) => {
    if (isValidEmail(e.target.value)) {
      setTo(e.target.value);
      setUserCheck(true);
    }
  };
  const handleSearch = debounceHandler(doSearch, 500);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (conversation?.length > 0) {
      // edit conversation
      editConversation({
        id: conversation?.[0]?.id,
        body: {
          message,
          timestamp: new Date().getTime(),
        },
      });
    } else if (conversation?.length === 0) {
      const { email, id, name } = participant?.[0];
      // add conversation
      addConversation({
        sender: loggedInEmail,
        data: {
          participants: `${loggedInEmail}-${email}`,
          users: [loggedInUser, { id, email, name }],
          message,
          timestamp: new Date().getTime(),
        },
      });
    }
  };
  return (
    open && (
      <>
        <div
          onClick={control}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"></div>
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Send message
          </h2>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="to" className="sr-only">
                  To
                </label>
                <input
                  onChange={handleSearch}
                  id="to"
                  name="to"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Send to"
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  id="message"
                  name="message"
                  type="message"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Message"
                />
              </div>
            </div>

            <div>
              <button
                disabled={
                  conversation === undefined ||
                  participant?.[0]?.email === loggedInEmail ||
                  participant?.length === 0
                }
                type="submit"
                className={`${
                  conversation === undefined && "bg-gray-400 cursor-not-allowed"
                } group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500`}>
                Send Message
              </button>
            </div>
            {isLoading && <p>Loading...</p>}
            {participant?.[0]?.email === loggedInEmail && (
              <Error message="You cannot send a message to yourself" />
            )}
            {participant?.length === 0 && (
              <Error message="User does not exist" />
            )}
            {error && <Error message={error} />}
          </form>
        </div>
      </>
    )
  );
}
