import { cn } from "@/lib/utils";

interface ChatMessageProps {
    isOutgoing: boolean;
    message: string;
    time: string;
}

export function ChatMessage({ isOutgoing, message, time }: ChatMessageProps) {
    return (
        <div className={cn("flex items-end gap-2", isOutgoing && "justify-end")}>
            <div className={cn(
                "max-w-xs lg:max-w-md p-3 rounded-lg",
                isOutgoing ? "bg-primary text-primary-foreground" : "bg-gray-100"
            )}>
                <p className="text-sm">{message}</p>
                <p className={cn(
                    "text-xs text-right mt-1",
                    isOutgoing ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>{time}</p>
            </div>
        </div>
    );
}