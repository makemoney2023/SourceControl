import { ChatThread } from "@/components/chat/ChatThread";
import { SiteNav } from "@/components/layout/SiteNav";

export default function HomePage() {
  return (
    <>
      <SiteNav active="/" />
      <ChatThread />
    </>
  );
}
