import { CircleHelp, Printer } from "lucide-react";


export default function Home() {
  return (
    <main className="h-screen flex flex-col bg-[#f6f7f9] overflow-hidden">
      {/* Header */}
      <header className="h-24 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#3157F6] flex items-center justify-center text-white">
              <Printer size={24} strokeWidth={2.2} />
            </div>

            <div>
              <h1 className="text-[24px] leading-tight font-bold text-gray-950">
                AI Print Assistant
              </h1>

              <p className="text-[16px] text-gray-500 mt-1">
                Online • Ready to help
              </p>
            </div>
          </div>

          <button className="text-gray-600 hover:text-[#3157F6] transition cursor-pointer">
            <CircleHelp size={22} strokeWidth={2.2} />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <section className="flex-1">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          Chat Area
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-8 py-4">
          Input Area
        </div>
      </footer>
    </main>
  );
}