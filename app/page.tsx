export default function Home() {
  return (
    <main className="h-screen flex flex-col bg-[#f6f7f9]">
      {/* Header */}
      <header className="h-24 bg-white border-b">
        Header
      </header>

      {/* Chat Area */}
      <section className="flex-1">
        Chat Area
      </section>

      {/* Input Area */}
      <footer className="h-24 bg-white border-t">
        Input Area
      </footer>
    </main>
  );
}