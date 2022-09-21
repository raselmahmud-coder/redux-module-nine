import ChatItem from "./ChatItem";
import { useSelector } from "react-redux/es/exports";
import { useGetConversationsQuery } from "../../features/conversations/conversationsApi";
import Error from "../ui/Error";
import moment from "moment";
import getPartnersInfo from "../../utils/getPartnersInfo";
import gravatarUrl from "gravatar-url";
import { Link } from "react-router-dom";

export default function ChatItems() {
  const { user } = useSelector((state) => state.auth);
  const {
    data: conversations,
    isLoading,
    error,
  } = useGetConversationsQuery(
    { email: user?.email },
    /*  { refetchOnMountOrArgChange: true }, */
  );
  // decide what to render
  let content = null;
  if (isLoading)
    content = <li className="m-2 text-center text-2xl">Loading...</li>;
  if (!isLoading && error)
    content = (
      <li className="m-2 text-center text-2xl">
        <Error message={error} />
      </li>
    );
  if (!isLoading && !error && conversations?.length === 0) {
    content = (
      <li className="m-2 text-center text-2xl">No conversations yet</li>
    );
  }
  if (!isLoading && !error && conversations?.length > 0) {
    content = conversations.map((item) => {
      const { id, message, timestamp } = item;
      const { name, email: partnerEmail } = getPartnersInfo(
        item.users,
        user?.email,
      );

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
    });
  }
  return <ul>{content}</ul>;
}
