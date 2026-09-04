import { About } from "./components/About";
import { ChatWidget } from "./components/ChatWidget";
import { QuestNav } from "./components/QuestNav";
import { Connect } from "./components/Connect";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Journey } from "./components/Journey";
import { Projects } from "./components/Projects";

export default function App() {
  return (
    <div className="relative min-h-screen bg-void text-ash">
      <QuestNav />
      <main>
        <Hero />
        <About />
        <Journey />
        <Projects />
        <Connect />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
