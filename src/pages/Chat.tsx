import { ConversationList } from "@/components/chat/ConversationList";
import { ChatWindow } from "@/components/chat/ChatWindow";

export default function Chat() {
  return (
    <div className="h-full flex bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="w-[320px] border-r flex-shrink-0 bg-white">
        <ConversationList />
      </div>
      <div className="flex-1 flex flex-col">
        <ChatWindow />
      </div>
    </div>
  );
}