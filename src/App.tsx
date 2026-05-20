import { ThemeProvider } from "./components/ThemeProvider";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import SkillsMatrix from "./components/SkillsMatrix";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen">
        {/* Navigation Control */}
        <Header />

        {/* Global Structural Sections */}
        <main>
          {/* Hero segment featuring interactive typing cycle */}
          <Hero />

          {/* About segment detailing dual boot Kali/Win lab specs */}
          <About />

          {/* Core skills segmented bar matrix */}
          <SkillsMatrix />

          {/* Featured software projects specs and live debug drawer */}
          <Projects />

          {/* secured contact channel with automated handshake transmission emulation */}
          <Contact />
        </main>

        {/* System footer telemetry indicator */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}
