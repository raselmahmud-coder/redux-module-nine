import ChatItem from "./ChatItem";
import { useDispatch, useSelector } from "react-redux/es/exports";
import {
  conversationApi,
  useGetConversationsQuery,
} from "../../features/conversations/conversationsApi";
import Error from "../ui/Error";
import moment from "moment";
import getPartnersInfo from "../../utils/getPartnersInfo";
import gravatarUrl from "gravatar-url";
import { Link } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState } from "react";
import { useEffect } from "react";

export default function ChatItems() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const {
    data: { conversations, totalCount } = {},
    isLoading,
    isError,
    error,
  } = useGetConversationsQuery({ email: user?.email });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const fetchMoreData = () => {
    // if (conversations.length >= totalCount) {
    //   setHasMore(false);
    //   return;
    // }
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (page > 1) {
      dispatch(
        conversationApi.endpoints.getMoreConversations.initiate({
          email: user?.email,
          page,
        }),
      );
    }
  }, [dispatch, page, user?.email]);
  useEffect(() => {
    if (totalCount) {
      const more =
        Math.ceil(
          totalCount / Number(process.env.REACT_APP_CONVERSATIONS_PER_PAGE),
        ) > page;
      setHasMore(more);
    }
  }, [totalCount, page]);
  // decide what to render
  let content = null;
  if (isLoading)
    content = <li className="m-2 text-center text-2xl">Loading...</li>;
  if (
    isError &&
    (error?.data === "jwt expired" ||
      error?.data === "Unauthorized" ||
      error?.data === "invalid token")
  ) {
    dispatch(logout());
  }

  if (!isLoading && error)
    content = (
      <li className="m-2 text-center text-2xl">
        <Error message={error?.data} />
      </li>
    );
  if (!isLoading && !error && conversations?.length === 0) {
    content = (
      <li className="m-2 text-center text-2xl">No conversations yet</li>
    );
  }
  if (!isLoading && !error && conversations?.length > 0) {
    content = (
      <InfiniteScroll
        dataLength={conversations.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4 className="text-center font-bold">Loading...</h4>}
        height={window.innerHeight - 200}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }>
        {conversations.map((item) => {
          const { id, message, timestamp } = item;
          const { name, email: partnerEmail } = getPartnersInfo(
            item.users,
            user?.email,
          );
          // console.log(getPartnersInfo(item.users, user?.email));
          return (
            <li key={id}>
              <Link to={`/inbox/${id}`}>
                <ChatItem
                  avatar={gravatarUrl(partnerEmail, { size: 90 })}
                  name={name}
                  lastMessage={message}
                  lastTime={moment(timestamp).fromNow()}
                />
              </Link>
            </li>
          );
        })}
      </InfiniteScroll>
    );
  }
  return (
    <>
      <ul>{content}</ul>
    </>
  );
}
