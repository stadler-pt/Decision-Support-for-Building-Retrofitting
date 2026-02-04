import { Leaf, Home, Zap } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl gradient-eco flex items-center justify-center shadow-eco">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <Leaf className="absolute -top-1 -right-1 w-4 h-4 text-accent animate-bounce-gentle" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gradient">
                Home Energy Efficiency Advisor
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Powered by AI for sustainable living
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 animate-fade-in stagger-2">
            <div className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-secondary rounded-full">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-secondary-foreground">UK EPC Data</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
