import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import EnergyForm from "@/components/EnergyForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import ResultsSection from "@/components/ResultsSection";
import Footer from "@/components/Footer";

interface FormData {
  buildingType: string;
  propertyType: string;
  tenure: string;
  constructionAge: string;
  floorArea: number;
  primaryFuel: string;
  heatingSystem: string;
  glazingType: string;
  wallDescription: string;
  roofDescription: string;
  floorDescription: string;
  hasSolarPV: boolean;
  hasSolarWater: boolean;
}

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

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ResultsData | null>(null);

  // Dummy data generator based on form inputs
  const generateDummyResults = (formData: FormData): ResultsData => {
    // Base score calculation (simplified)
    let baseScore = 50;
    
    // Age adjustments
    if (formData.constructionAge === "2012 onwards") baseScore += 25;
    else if (formData.constructionAge === "2007-2011") baseScore += 20;
    else if (formData.constructionAge === "2003-2006") baseScore += 15;
    else if (formData.constructionAge === "1996-2002") baseScore += 10;
    else if (formData.constructionAge === "Before 1900") baseScore -= 10;

    // Heating system adjustments
    if (formData.heatingSystem.includes("Heat pump")) baseScore += 15;
    else if (formData.heatingSystem.includes("Boiler and radiators (mains gas)")) baseScore += 5;
    else if (formData.heatingSystem.includes("Electric storage")) baseScore -= 5;

    // Solar adjustments
    if (formData.hasSolarPV) baseScore += 8;
    if (formData.hasSolarWater) baseScore += 4;

    // Insulation adjustments
    if (formData.roofDescription.includes("270 mm")) baseScore += 5;
    else if (formData.roofDescription.includes("no insulation")) baseScore -= 8;
    
    if (formData.wallDescription.includes("filled cavity")) baseScore += 5;
    else if (formData.wallDescription.includes("no insulation")) baseScore -= 8;

    // Glazing adjustments
    if (formData.glazingType.includes("Triple")) baseScore += 5;
    else if (formData.glazingType.includes("Single")) baseScore -= 10;

    // Ensure score is within bounds
    baseScore = Math.min(Math.max(baseScore, 20), 95);

    // Generate improvement scenarios
    const scenarios: Scenario[] = [];

    // Loft insulation improvement
    if (!formData.roofDescription.includes("270 mm")) {
      scenarios.push({
        key: "loft_to_300",
        label: "Increase loft insulation to 300mm",
        applicable: true,
        reason: `Current: ${formData.roofDescription}. Adding more insulation will reduce heat loss.`,
        ee_after: Math.min(baseScore + 3.5, 100),
        uplift: 3.5,
      });
    }

    // Wall insulation
    if (formData.wallDescription.includes("no insulation") || formData.wallDescription.includes("unfilled")) {
      scenarios.push({
        key: "wall_insulation",
        label: "Add cavity wall insulation",
        applicable: true,
        reason: "Your walls may be losing significant heat. Insulation could make a big difference.",
        ee_after: Math.min(baseScore + 5.2, 100),
        uplift: 5.2,
      });
    }

    // Glazing upgrade
    if (!formData.glazingType.includes("Triple") && !formData.glazingType.includes("2002")) {
      scenarios.push({
        key: "glazing_upgrade",
        label: "Upgrade to modern double or triple glazing",
        applicable: true,
        reason: "Newer glazing technology can significantly reduce heat loss through windows.",
        ee_after: Math.min(baseScore + 2.8, 100),
        uplift: 2.8,
      });
    }

    // Solar PV
    if (!formData.hasSolarPV) {
      scenarios.push({
        key: "add_solar_pv",
        label: "Install solar PV panels",
        applicable: true,
        reason: "Generate your own electricity and reduce dependence on the grid.",
        ee_after: Math.min(baseScore + 8.5, 100),
        uplift: 8.5,
      });
    }

    // Heating upgrade
    if (!formData.heatingSystem.includes("Heat pump")) {
      scenarios.push({
        key: "heat_pump",
        label: "Install an air source heat pump",
        applicable: true,
        reason: "Heat pumps are highly efficient and can dramatically lower energy costs.",
        ee_after: Math.min(baseScore + 12.0, 100),
        uplift: 12.0,
      });
    }

    // Floor insulation
    if (formData.floorDescription.includes("no insulation")) {
      scenarios.push({
        key: "floor_insulation",
        label: "Add floor insulation",
        applicable: true,
        reason: "Uninsulated floors can account for significant heat loss.",
        ee_after: Math.min(baseScore + 1.8, 100),
        uplift: 1.8,
      });
    }

    // Smart controls
    scenarios.push({
      key: "smart_controls",
      label: "Install smart heating controls",
      applicable: true,
      reason: "Smart thermostats can optimize heating schedules and reduce waste.",
      ee_after: Math.min(baseScore + 2.0, 100),
      uplift: 2.0,
    });

    return {
      ee_now: Math.round(baseScore * 10) / 10,
      scenarios,
    };
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const results = generateDummyResults(formData);
    setResults(results);
    setIsLoading(false);

    // Scroll to results
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleReset = () => {
    setResults(null);
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
