import { Leaf, Lightbulb, Zap } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = "Calculating your energy score..." }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      {/* Main spinning container */}
      <div className="relative w-24 h-24 mb-6">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-secondary animate-spin-slow" />
        
        {/* Inner gradient ring */}
        <div className="absolute inset-2 rounded-full gradient-eco opacity-20 animate-pulse-soft" />
        
        {/* Center icon container */}
        <div className="absolute inset-4 rounded-full bg-card shadow-eco flex items-center justify-center">
          <div className="relative">
            <Leaf className="w-8 h-8 text-primary animate-bounce-gentle" />
          </div>
        </div>
        
        {/* Orbiting icons */}
        <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '4s' }}>
          <Lightbulb className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 text-warning" />
        </div>
        <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '4s', animationDelay: '-1.33s' }}>
          <Zap className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 text-accent" />
        </div>
        <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '4s', animationDelay: '-2.66s' }}>
          <Leaf className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Loading text */}
      <p className="text-lg font-medium text-foreground mb-2">{message}</p>
      
      {/* Animated dots */}
      <div className="flex gap-1.5">
        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.15s' }} />
        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.3s' }} />
      </div>

      {/* Eco tip */}
      <p className="text-sm text-muted-foreground mt-6 max-w-xs text-center">
        💡 Tip: Even small improvements can significantly reduce your energy bills!
      </p>
    </div>
  );
};

export default LoadingSpinner;
