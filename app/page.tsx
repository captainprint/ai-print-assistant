import Header from "@/components/Header";
import ChatArea from "@/components/ChatArea";
import ChatInput from "@/components/ChatInput";

export default function Home() {
  return (
    <main className="h-screen flex flex-col bg-[#f6f7f9] overflow-hidden">
      <Header />
      <ChatArea />
      <ChatInput />
    </main>
  );
}