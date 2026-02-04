import { Sun, Leaf, ArrowRight, RotateCcw, Lightbulb, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import ScoreGauge from "./ScoreGauge";
import ScenarioCard from "./ScenarioCard";

interface Scenario {
  key: string;
  label: string;
  applicable: boolean;
  reason: string;
  ee_after: number;
  uplift: number;
}

interface ResultsData {
  ee_now: number;
  scenarios: Scenario[];
}

interface ResultsSectionProps {
  data: ResultsData;
  onReset: () => void;
}

const ResultsSection = ({ data, onReset }: ResultsSectionProps) => {
  // Sort scenarios by uplift descending
  const sortedScenarios = [...data.scenarios].sort((a, b) => b.uplift - a.uplift);

  const insights = [
    "Low roof insulation is affecting your score. Adding more insulation could improve efficiency significantly.",
    "Your glazing may be allowing heat loss. Modern double or triple glazing can make a big difference.",
    "Consider upgrading your heating system to a more efficient model.",
    "Solar panels could help reduce your electricity costs and carbon footprint.",
  ];

  return (
    <section className="py-12 animate-fade-up">
      <div className="container mx-auto px-4">
        {/* Score Gauge */}
        <ScoreGauge score={data.ee_now} />

        {/* Improvement Scenarios */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-eco flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Recommended Improvements</h3>
              <p className="text-sm text-muted-foreground">Sorted by impact on your score</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedScenarios.map((scenario, index) => (
              <ScenarioCard
                key={scenario.key}
                scenario={scenario}
                index={index}
                currentScore={data.ee_now}
              />
            ))}
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-12 animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-warning" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Key Insights</h3>
          </div>

          <div className="bg-card rounded-2xl shadow-eco border border-border/50 p-6">
            <ul className="space-y-4">
              {insights.map((insight, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 animate-fade-in opacity-0"
                  style={{ 
                    animationDelay: `${0.6 + index * 0.1}s`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{insight}</span>
                </li>
              ))}
            </ul>

            {/* SDG Connection */}
            <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-5 h-5 text-warning" />
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                These improvements support <strong>SDG 7 (Affordable and Clean Energy)</strong> by 
                cutting your energy bills and reducing carbon emissions. Small changes in your 
                home can make a big difference for the planet!
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer and Reset */}
        <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p className="text-sm text-muted-foreground mb-6">
            ⚠️ <em>Estimate only; please consult qualified professionals for accurate assessments and installations.</em>
          </p>
          
          <Button
            variant="outline"
            size="lg"
            onClick={onReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Start New Assessment
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
