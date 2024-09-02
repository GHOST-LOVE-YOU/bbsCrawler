import InboxHeader from "@/components/inbox/InboxHeader";
import InboxContent from "@/components/inbox/InboxContent";

async function InboxCommentContent() {
  const { userGetMessages } = await import("@/lib/messages/server-utils");
  const { MessagesType } = await import("@prisma/client");
  const messages = await userGetMessages([
    MessagesType.COMMENT_REPLY,
    MessagesType.WATCHED_COMMENT_NEW_QUOTED,
  ]);

  return <InboxContent messages={messages} />;
}

export default async function NotificationPanel() {
  return (
    <>
      <InboxHeader />
      <InboxCommentContent />
    </>
  );
}
