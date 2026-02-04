import { Leaf, Sun, Wind, Droplets } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-24 pb-12 overflow-hidden gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Leaf className="absolute top-20 left-[10%] w-8 h-8 text-primary/20 animate-float" style={{ animationDelay: '0s' }} />
        <Sun className="absolute top-32 right-[15%] w-10 h-10 text-warning/20 animate-float" style={{ animationDelay: '1s' }} />
        <Wind className="absolute bottom-20 left-[20%] w-6 h-6 text-accent/20 animate-float" style={{ animationDelay: '2s' }} />
        <Droplets className="absolute top-40 left-[60%] w-7 h-7 text-primary/15 animate-float" style={{ animationDelay: '1.5s' }} />
        <Leaf className="absolute bottom-32 right-[25%] w-9 h-9 text-accent/15 animate-float" style={{ animationDelay: '0.5s' }} />
        
        {/* Wave pattern */}
        <svg className="absolute bottom-0 left-0 right-0 w-full h-24 text-background" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-fade-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Discover Your Home's{" "}
              <span className="text-gradient">Energy Potential</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Enter your home details to get an estimated energy efficiency score and 
              personalized tips to go greener. Powered by AI for sustainable living.
            </p>
          </div>

          {/* SDG Badges */}
          <div className="flex items-center justify-center gap-4 animate-fade-in stagger-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-eco border border-border/50">
              <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center">
                <Sun className="w-4 h-4 text-warning" />
              </div>
              <span className="text-sm font-medium">SDG 7</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-eco border border-border/50">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <Home className="w-4 h-4 text-accent" />
              </div>
              <span className="text-sm font-medium">SDG 11</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Need to import Home for SDG badge
import { Home } from "lucide-react";

export default HeroSection;
