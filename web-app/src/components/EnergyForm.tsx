import { useState } from "react";
import { ChevronDown, Home, Flame, Layers, Sun, Calculator } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import FormTooltip from "./FormTooltip";

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

interface EnergyFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const EnergyForm = ({ onSubmit, isLoading }: EnergyFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    buildingType: "",
    propertyType: "",
    tenure: "Owner-occupied",
    constructionAge: "",
    floorArea: 0,
    primaryFuel: "",
    heatingSystem: "",
    glazingType: "Double glazing, unknown install date",
    wallDescription: "Cavity wall, filled cavity",
    roofDescription: "Pitched, 270 mm loft insulation",
    floorDescription: "Suspended, no insulation (assumed)",
    hasSolarPV: false,
    hasSolarWater: false,
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<string[]>(["basic"]);

  const buildingTypes = [
    "Semi-detached",
    "Mid-terrace",
    "Detached",
    "End-terrace",
    "Enclosed mid-terrace",
    "Enclosed end-terrace",
  ];

  const propertyTypes = ["House", "Bungalow", "Flat", "Maisonette"];

  const tenureOptions = [
    "Owner-occupied",
    "Rented (private)",
    "Rented (social)",
    "Unknown",
  ];

  const constructionAges = [
    "Before 1900",
    "1900-1929",
    "1930-1949",
    "1950-1966",
    "1967-1975",
    "1976-1982",
    "1983-1990",
    "1991-1995",
    "1996-2002",
    "2003-2006",
    "2007-2011",
    "2012 onwards",
  ];

  const primaryFuels = [
    "Mains gas",
    "Electricity",
    "Oil",
    "LPG",
    "Wood chips",
    "Dual fuel (mineral + wood)",
  ];

  const heatingSystems = [
    "Boiler and radiators (mains gas)",
    "Boiler and radiators (oil)",
    "Boiler and radiators (LPG)",
    "Electric storage heaters",
    "Electric panel heaters",
    "Heat pump (air source)",
    "Heat pump (ground source)",
    "District heating",
    "Warm air system",
    "Room heaters (gas)",
    "Room heaters (electric)",
  ];

  const glazingTypes = [
    "Double glazing, unknown install date",
    "Double glazing installed during or after 2002",
    "Double glazing installed before 2002",
    "Triple glazing",
    "Single glazing",
    "Secondary glazing",
  ];

  const wallDescriptions = [
    "Cavity wall, filled cavity",
    "Cavity wall, unfilled cavity",
    "Solid brick, as built, no insulation (assumed)",
    "Solid brick, with external insulation",
    "Solid brick, with internal insulation",
    "Timber frame, insulated",
    "System built, as built",
  ];

  const roofDescriptions = [
    "Pitched, 270 mm loft insulation",
    "Pitched, 200 mm loft insulation",
    "Pitched, 100 mm loft insulation",
    "Pitched, 50 mm loft insulation",
    "Pitched, no insulation (assumed)",
    "Flat, limited insulation",
    "Flat, insulated",
    "Room-in-roof, insulated",
    "Room-in-roof, no insulation",
  ];

  const floorDescriptions = [
    "Suspended, no insulation (assumed)",
    "Suspended, insulated",
    "Solid, no insulation (assumed)",
    "Solid, insulated",
    "To external air, no insulation",
    "To unheated space, no insulation",
  ];

  const handleChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    
    if (!formData.buildingType) newErrors.buildingType = true;
    if (!formData.propertyType) newErrors.propertyType = true;
    if (!formData.constructionAge) newErrors.constructionAge = true;
    if (!formData.floorArea || formData.floorArea < 10 || formData.floorArea > 1000) {
      newErrors.floorArea = true;
    }
    if (!formData.primaryFuel) newErrors.primaryFuel = true;
    if (!formData.heatingSystem) newErrors.heatingSystem = true;

    setErrors(newErrors);
    
    // Expand sections with errors
    if (Object.keys(newErrors).length > 0) {
      const sectionsToExpand: string[] = [];
      if (newErrors.buildingType || newErrors.propertyType || newErrors.tenure || 
          newErrors.constructionAge || newErrors.floorArea) {
        sectionsToExpand.push("basic");
      }
      if (newErrors.primaryFuel || newErrors.heatingSystem) {
        sectionsToExpand.push("heating");
      }
      setExpandedSections([...new Set([...expandedSections, ...sectionsToExpand])]);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const SelectField = ({
    label,
    field,
    options,
    required = false,
    tooltip,
    placeholder = "Select an option",
  }: {
    label: string;
    field: keyof FormData;
    options: string[];
    required?: boolean;
    tooltip?: string;
    placeholder?: string;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label htmlFor={field} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {tooltip && <FormTooltip content={tooltip} />}
      </div>
      <Select
        value={formData[field] as string}
        onValueChange={(value) => handleChange(field, value)}
      >
        <SelectTrigger
          id={field}
          className={`form-focus ${errors[field] ? "border-destructive animate-shake" : ""}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] bg-popover">
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="animate-fade-up">
      <div className="bg-card rounded-2xl shadow-eco-lg border border-border/50 overflow-hidden">
        <Accordion
          type="multiple"
          value={expandedSections}
          onValueChange={setExpandedSections}
          className="w-full"
        >
          {/* Basic Home Info */}
          <AccordionItem value="basic" className="border-b border-border/50">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-eco flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Basic Home Info</p>
                  <p className="text-sm text-muted-foreground">Property type, age, and size</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <SelectField
                  label="Building Type"
                  field="buildingType"
                  options={buildingTypes}
                  required
                  tooltip="The structural type of your building"
                  placeholder="Select building type"
                />
                <SelectField
                  label="Property Type"
                  field="propertyType"
                  options={propertyTypes}
                  required
                  tooltip="The category of your property"
                  placeholder="Select property type"
                />
                <SelectField
                  label="Tenure"
                  field="tenure"
                  options={tenureOptions}
                  tooltip="Your ownership or rental status"
                />
                <SelectField
                  label="Construction Age"
                  field="constructionAge"
                  options={constructionAges}
                  required
                  tooltip="When your property was built"
                  placeholder="Select construction period"
                />
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="floorArea" className="text-sm font-medium">
                      Floor Area (sqm)
                      <span className="text-destructive ml-1">*</span>
                    </Label>
                    <FormTooltip content="Total internal floor area of your property in square metres (10-1000)" />
                  </div>
                  <Input
                    id="floorArea"
                    type="number"
                    min={10}
                    max={1000}
                    placeholder="e.g., 85"
                    value={formData.floorArea || ""}
                    onChange={(e) => handleChange("floorArea", Number(e.target.value))}
                    className={`form-focus ${errors.floorArea ? "border-destructive animate-shake" : ""}`}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Heating System */}
          <AccordionItem value="heating" className="border-b border-border/50">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-warning" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Heating System</p>
                  <p className="text-sm text-muted-foreground">Fuel type and heating method</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <SelectField
                  label="Primary Fuel"
                  field="primaryFuel"
                  options={primaryFuels}
                  required
                  tooltip="The main fuel source for heating"
                  placeholder="Select fuel type"
                />
                <SelectField
                  label="Heating System"
                  field="heatingSystem"
                  options={heatingSystems}
                  required
                  tooltip="Your main heating system type"
                  placeholder="Select heating system"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Insulation Details */}
          <AccordionItem value="insulation" className="border-b border-border/50">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Insulation Details</p>
                  <p className="text-sm text-muted-foreground">Walls, roof, floor, and glazing</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <SelectField
                  label="Glazing Type"
                  field="glazingType"
                  options={glazingTypes}
                  tooltip="The type of windows in your property"
                />
                <SelectField
                  label="Wall Description"
                  field="wallDescription"
                  options={wallDescriptions}
                  tooltip="Your wall construction and insulation"
                />
                <SelectField
                  label="Roof Description"
                  field="roofDescription"
                  options={roofDescriptions}
                  tooltip="Your roof type and insulation level"
                />
                <SelectField
                  label="Floor Description"
                  field="floorDescription"
                  options={floorDescriptions}
                  tooltip="Your floor type and insulation"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Renewables */}
          <AccordionItem value="renewables">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Renewable Energy</p>
                  <p className="text-sm text-muted-foreground">Solar and other renewables</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-secondary/50">
                  <Checkbox
                    id="solarPV"
                    checked={formData.hasSolarPV}
                    onCheckedChange={(checked) => handleChange("hasSolarPV", checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="solarPV" className="text-sm font-medium cursor-pointer">
                      Has Solar PV Panels?
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Photovoltaic panels that generate electricity
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-xl bg-secondary/50">
                  <Checkbox
                    id="solarWater"
                    checked={formData.hasSolarWater}
                    onCheckedChange={(checked) => handleChange("hasSolarWater", checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="solarWater" className="text-sm font-medium cursor-pointer">
                      Has Solar Water Heating?
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Solar thermal panels for hot water
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Submit Button */}
        <div className="p-6 bg-secondary/30">
          <Button
            type="submit"
            variant="hero"
            size="xl"
            className="w-full gap-2"
            disabled={isLoading}
          >
            <Calculator className="w-5 h-5" />
            {isLoading ? "Calculating..." : "Calculate My Score"}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-3">
            Fields marked with <span className="text-destructive">*</span> are required
          </p>
        </div>
      </div>
    </form>
  );
};

export default EnergyForm;
