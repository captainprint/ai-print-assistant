"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatArea() {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, []);

    return (
        <section className="flex-1 overflow-y-auto">
            <div className="max-w-[900px] mx-auto px-8 py-8 pb-8 space-y-6">
                <MessageBubble
                    role="ai"
                    message="Hello! I'm your AI Print Assistant. I can help you with printing services, paper types, file formats, finishing options, turnaround times, and more. How can I assist you today?"
                    time="11:56 AM"
                />

                <MessageBubble
                    role="user"
                    message="I need business cards."
                    time="11:57 AM"
                />

                <MessageBubble
                    role="ai"
                    message="Great! For business cards, I can help you choose the right size, paper type, finish, quantity, and turnaround time. Do you want something standard and affordable, or something premium like foil, raised spot UV, or soft touch?"
                    time="11:58 AM"
                />
                
                <div ref={bottomRef} />
            </div>
        </section>
    );
}