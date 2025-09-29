import { useState, useEffect } from "react";
import { EditionSelector } from "@/components/EditionSelector";
import { ProgressTracker } from "@/components/ProgressTracker";
import { WalletConnect } from "@/components/WalletConnect";
import { NetworkStatus } from "@/components/NetworkStatus";
import heroBg from "@/assets/plasma-brand-hero.jpg";

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    
    const timer1 = setTimeout(() => setAnimationPhase(1), 500);
    const timer2 = setTimeout(() => setAnimationPhase(2), 1500);
    const timer3 = setTimeout(() => setAnimationPhase(3), 2500);
    const timer4 = setTimeout(() => setShowIntro(false), 60000); 

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const handleSkipIntro = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return (
      <div 
        className="min-h-screen bg-background flex items-center justify-center overflow-hidden relative cursor-pointer"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        onClick={handleSkipIntro}
      >
        
        <div className="absolute inset-0 bg-background/80" />
        <div className="text-center space-y-8 max-w-4xl px-8 relative z-10">
          
          <div className={`transition-all duration-1000 ${animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="chapter-title text-6xl md:text-8xl font-black mb-4 tracking-tight">
              Where Money Moves
            </h1>
          </div>

          
          <div className={`transition-all duration-1000 delay-500 ${animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="text-2xl md:text-4xl text-muted-foreground font-light mb-2">
              Chapter 1
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent w-64 mx-auto" />
          </div>

          
          <div className={`transition-all duration-1000 delay-1000 ${animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-lg md:text-xl text-foreground/80 font-light leading-relaxed">
              Thirteen historic editions capturing<br />
              Plasma's rise as the canonical settlement layer for stablecoins.
            </p>
          </div>

          
          <div className={`transition-all duration-1000 delay-2000 ${animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-sm text-muted-foreground/60 mt-12 animate-pulse">
              Click anywhere to continue
            </p>
          </div>
        </div>

        
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
      
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="chapter-title text-3xl font-bold">Where Money Moves</h1>
              <p className="text-muted-foreground text-sm mt-1">Chapter 1: Pre-TGE</p>
            </div>
            <div className="flex items-center gap-4">
              <NetworkStatus />
              <ProgressTracker />
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Mint Financial History
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Thirteen collectible editions capturing pivotal moments in Plasma's journey to redefine how money moves. 
            Each edition documents the evolution of stablecoin infrastructure for a new global financial system, 
            leading up to the token generation event on <span className="text-primary font-medium">September 25, 2025</span>.
          </p>
        </div>

        <EditionSelector />
      </main>

      
      <footer className="border-t border-border/50 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
              <img src="/favicon.ico" alt="Plasma" className="w-5 h-5" />
              <span>
                Built on Plasma — Stablecoin infrastructure for a new global financial system.
              </span>
            </div>
            
            <div className="bg-muted/30 border border-border/30 rounded-lg p-4 max-w-4xl mx-auto">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Disclaimer:</strong> This is a community-curated collection and is not officially associated with the Plasma project. 
                These collectible editions are based on articles created by{" "}
                <a 
                  href="https://x.com/proofofnathan" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-glow transition-colors font-medium"
                >
                  @proofofnathan
                </a>
                , a gigachad growth lead at Plasma, to ensure our community gets a piece of the new financial system dubbed{" "}
                <span className="text-primary font-medium">Money 2.0</span>
              </p>
            </div>
            
            <div className="text-xs text-muted-foreground/70">
              Built with{" "}
              <a 
                href="https://x.com/0xelegant" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-glow transition-colors"
              >
                Money 2.0
              </a>{" "}
              by{" "}
              <a 
                href="https://x.com/0xelegant" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-glow transition-colors"
              >
                @0xelegant
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;