import { ArrowRight, RotateCcw, Lightbulb, TrendingUp, Star } from "lucide-react";
import { Button } from "./ui/button";
import ScoreGauge from "./ScoreGauge";
import ScenarioCard from "./ScenarioCard";
import type { ResultsData } from "@/pages/Index";

interface ResultsSectionProps {
  data: ResultsData;
  onReset: () => void;
}

const ResultsSection = ({ data, onReset }: ResultsSectionProps) => {
  // Use top_recommendations if available, otherwise fall back to all scenarios sorted by uplift
  const topRecs = data.top_recommendations?.length
    ? data.top_recommendations
    : [...data.scenarios].filter((s) => s.uplift > 0).sort((a, b) => b.uplift - a.uplift).slice(0, 3);

  const allScenarios = [...data.scenarios].sort((a, b) => b.uplift - a.uplift);

  return (
    <section className="py-12 animate-fade-up">
      <div className="container mx-auto px-4">
        {/* Score Gauge */}
        <ScoreGauge score={data.ee_now} />

        {/* Top Recommendations */}
        {topRecs.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Top Recommendations</h3>
                <p className="text-sm text-muted-foreground">Highest-impact improvements for your home</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topRecs.map((scenario, index) => (
                <ScenarioCard
                  key={scenario.key}
                  scenario={scenario}
                  index={index}
                  currentScore={data.ee_now}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Scenarios */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-eco flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">All Improvement Scenarios</h3>
              <p className="text-sm text-muted-foreground">Every scenario analysed for your property</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allScenarios.map((scenario, index) => (
              <ScenarioCard
                key={scenario.key}
                scenario={scenario}
                index={index}
                currentScore={data.ee_now}
              />
            ))}
          </div>
        </div>

        {/* Disclaimer and Reset */}
        <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p className="text-sm text-muted-foreground mb-6">
            <em>Estimate only; please consult qualified professionals for accurate assessments and installations.</em>
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
