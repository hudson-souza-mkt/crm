import { ConversationList } from "@/components/chat/ConversationList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ContactDetails } from "@/components/chat/ContactDetails";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function Chat() {
  return (
    <div className="h-[calc(100vh-theme(spacing.16))]">
      <ResizablePanelGroup direction="horizontal" className="h-full items-stretch">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
          <div className="h-full overflow-y-auto">
            <ConversationList />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <ChatWindow />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
          <div className="h-full overflow-y-auto bg-muted/30">
            <ContactDetails />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}