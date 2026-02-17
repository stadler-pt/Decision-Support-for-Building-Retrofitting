import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import EnergyForm from "@/components/EnergyForm";
import type { FormPayload } from "@/components/EnergyForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import ResultsSection from "@/components/ResultsSection";
import Footer from "@/components/Footer";

export interface Scenario {
  key: string;
  label: string;
  applicable: boolean;
  reason: string;
  ee_after: number;
  uplift: number;
}

export interface ResultsData {
  ee_now: number;
  scenarios: Scenario[];
  top_recommendations: Scenario[];
}

const API_URL = "https://precious-patience-production.up.railway.app/analyze";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ResultsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (payload: FormPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Analysis failed (${res.status}): ${text}`);
      }

      const data: ResultsData = await res.json();
      setResults(data);

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {!results && !isLoading && (
        <>
          <HeroSection />
          <main className="flex-1 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  {error}
                </div>
              )}
              <EnergyForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            </div>
          </main>
        </>
      )}

      {isLoading && (
        <main className="flex-1 flex items-center justify-center pt-20">
          <LoadingSpinner />
        </main>
      )}

      {results && !isLoading && (
        <main className="flex-1 pt-20">
          <ResultsSection data={results} onReset={handleReset} />
        </main>
      )}

      <Footer />
    </div>
  );
};

export default Index;
