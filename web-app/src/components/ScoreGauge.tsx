import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
}

const ScoreGauge = ({ score, maxScore = 100 }: ScoreGaugeProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  const getBand = (score: number): { band: string; color: string; bgColor: string } => {
    if (score >= 92) return { band: "A", color: "text-primary", bgColor: "bg-primary" };
    if (score >= 81) return { band: "B", color: "text-primary", bgColor: "bg-primary" };
    if (score >= 69) return { band: "C", color: "text-primary", bgColor: "bg-primary" };
    if (score >= 55) return { band: "D", color: "text-warning", bgColor: "bg-warning" };
    if (score >= 39) return { band: "E", color: "text-orange-500", bgColor: "bg-orange-500" };
    if (score >= 21) return { band: "F", color: "text-orange-600", bgColor: "bg-orange-600" };
    return { band: "G", color: "text-destructive", bgColor: "bg-destructive" };
  };

  const { band, color, bgColor } = getBand(score);
  const percentage = (score / maxScore) * 100;

  useEffect(() => {
    // Animate score counting up
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        setShowPulse(true);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  // EPC band colors for the scale
  const bands = [
    { band: "A", color: "bg-primary", range: "92+" },
    { band: "B", color: "bg-primary/80", range: "81-91" },
    { band: "C", color: "bg-primary/60", range: "69-80" },
    { band: "D", color: "bg-warning", range: "55-68" },
    { band: "E", color: "bg-orange-500", range: "39-54" },
    { band: "F", color: "bg-orange-600", range: "21-38" },
    { band: "G", color: "bg-destructive", range: "1-20" },
  ];

  return (
    <div className="animate-fade-up">
      <div className="bg-card rounded-2xl shadow-eco-lg p-6 md:p-8 border border-border/50">
        <h3 className="text-lg font-semibold text-foreground mb-6 text-center">
          Your Current Energy Efficiency Score
        </h3>
        
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Main Score Circle */}
          <div className={`relative w-48 h-48 ${showPulse ? 'animate-glow-pulse' : ''}`}>
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Track */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="10"
              />
              {/* Progress */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                style={{
                  stroke: `hsl(var(--${color.includes('primary') ? 'primary' : color.includes('warning') ? 'warning' : 'destructive'}))`,
                }}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(animatedScore / maxScore) * 264} 264`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-bold ${color}`}>
                {animatedScore.toFixed(1)}
              </span>
              <div className={`mt-2 px-4 py-1 rounded-full ${bgColor} text-primary-foreground font-bold text-lg`}>
                Band {band}
              </div>
            </div>
          </div>

          {/* EPC Scale */}
          <div className="flex-1 w-full max-w-xs">
            <p className="text-sm font-medium text-muted-foreground mb-3">EPC Rating Scale</p>
            <div className="space-y-1.5">
              {bands.map((b, index) => (
                <div
                  key={b.band}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
                    band === b.band ? 'bg-secondary scale-[1.02] shadow-eco' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-10 h-6 rounded ${b.color} flex items-center justify-center`}>
                    <span className="text-xs font-bold text-primary-foreground">{b.band}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{b.range}</span>
                  {band === b.band && (
                    <span className="ml-auto text-xs font-medium text-primary">← Your score</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Score interpretation */}
        <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
          <p className="text-center text-foreground">
            Your estimated current energy efficiency: <strong className={color}>{score.toFixed(1)}</strong> ({band} band)
            {score >= 69 && " - Great job! Your home is relatively efficient."}
            {score >= 55 && score < 69 && " - Room for improvement. Consider upgrades below."}
            {score < 55 && " - Significant potential for energy savings!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
