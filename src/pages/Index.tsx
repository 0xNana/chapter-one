import { useState, useEffect } from "react";
import { EditionSelector } from "@/components/EditionSelector";
import { ProgressTracker } from "@/components/ProgressTracker";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Intro animation sequence
    const timer1 = setTimeout(() => setAnimationPhase(1), 500);
    const timer2 = setTimeout(() => setAnimationPhase(2), 1500);
    const timer3 = setTimeout(() => setAnimationPhase(3), 2500);
    const timer4 = setTimeout(() => setShowIntro(false), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  if (showIntro) {
    return (
      <div 
        className="min-h-screen bg-background flex items-center justify-center overflow-hidden relative"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-background/80" />
        <div className="text-center space-y-8 max-w-4xl px-8 relative z-10">
          {/* Main Title */}
          <div className={`transition-all duration-1000 ${animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="chapter-title text-6xl md:text-8xl font-black mb-4 tracking-tight">
              Where Money Moves
            </h1>
          </div>

          {/* Chapter Subtitle */}
          <div className={`transition-all duration-1000 delay-500 ${animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-2xl md:text-4xl text-muted-foreground font-light mb-2">
              Chapter 1
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent w-64 mx-auto" />
          </div>

          {/* Subtitle */}
          <div className={`transition-all duration-1000 delay-1000 ${animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-lg md:text-xl text-foreground/80 font-light leading-relaxed">
              The pre-TGE arc. Thirteen historic editions capturing<br />
              Plasma's rise as the canonical settlement layer.
            </p>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full animate-float" />
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-accent/5 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-2/3 left-1/6 w-16 h-16 bg-primary-glow/5 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="chapter-title text-3xl font-bold">Where Money Moves</h1>
              <p className="text-muted-foreground text-sm mt-1">Chapter 1: Pre-TGE Arc</p>
            </div>
            <ProgressTracker />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Mint Financial History
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Thirteen collectible editions spanning the pre-TGE arc of Plasma. 
            Each edition captures a pivotal moment in the evolution of programmable finance 
            before the token generation event on <span className="text-primary font-medium">September 25, 2025</span>.
          </p>
        </div>

        <EditionSelector />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Powered by onchain infrastructure. Built for the future of finance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;