import Blank from "./Blank";
import { useGetMessagesQuery } from "../../../features/messages/messagesApi";
import ChatHead from "./ChatHead";
import Messages from "./Messages";
import Options from "./Options";
import { useParams } from "react-router-dom";
import Error from "../../ui/Error";

export default function ChatBody() {
  const { id } = useParams();
  const { isLoading, data: messages, error } = useGetMessagesQuery({ id });
  let content;
  if (isLoading) {
    content = <div className="text-center">Loading...</div>;
  } else if (!isLoading && error) {
    content = <Error message={error} />;
  } else if (!isLoading && !error && messages?.length === 0) {
    content = <Blank />;
  } else if (!isLoading && !error && messages?.length > 0) {
    content = (
      <>
        <ChatHead message={messages[0]} />
        <Messages messages={messages} />
        <Options />
      </>
    );
  }
  return (
    <div className="w-full lg:col-span-2 lg:block">
      <div className="w-full grid conversation-row-grid">
        {content}
        {/* <Blank /> */}
      </div>
    </div>
  );
}
