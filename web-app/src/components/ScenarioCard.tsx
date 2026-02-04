import { Check, TrendingUp, Info } from "lucide-react";
import { useEffect, useState } from "react";

interface Scenario {
  key: string;
  label: string;
  applicable: boolean;
  reason: string;
  ee_after: number;
  uplift: number;
}

interface ScenarioCardProps {
  scenario: Scenario;
  index: number;
  currentScore: number;
}

const ScenarioCard = ({ scenario, index, currentScore }: ScenarioCardProps) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const maxUplift = 10; // For visual scaling
  const progressWidth = Math.min((scenario.uplift / maxUplift) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(progressWidth);
    }, 100 + index * 150);
    return () => clearTimeout(timer);
  }, [progressWidth, index]);

  return (
    <div
      className="bg-card rounded-xl shadow-eco border border-border/50 overflow-hidden animate-fade-up opacity-0"
      style={{ 
        animationDelay: `${index * 0.1}s`,
        animationFillMode: 'forwards'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            {scenario.applicable ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              <Info className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground leading-tight">{scenario.label}</h4>
            <p className="text-sm text-muted-foreground mt-1">{scenario.reason}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 bg-secondary/30">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Score Uplift</p>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-xl font-bold text-primary">+{scenario.uplift.toFixed(1)}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">New Score</p>
            <span className="text-xl font-bold text-accent">{scenario.ee_after.toFixed(1)}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Impact</span>
            <span>{scenario.uplift.toFixed(1)} points</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-eco rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${animatedWidth}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioCard;
