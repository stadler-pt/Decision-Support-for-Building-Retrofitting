import { useState } from "react";
import { Home, Flame, Layers, Calculator, Settings2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
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

// Value → Label mappings for dropdowns
const P_TYPE_OPTIONS = [
  { value: "house", label: "House" },
  { value: "flat", label: "Flat" },
  { value: "bungalow", label: "Bungalow" },
  { value: "maisonette", label: "Maisonette" },
  { value: "park home", label: "Park home" },
];

const B_TYPE_OPTIONS = [
  { value: "detached", label: "Detached" },
  { value: "semi-detached", label: "Semi-detached" },
  { value: "end-terrace", label: "End-terrace" },
  { value: "mid-terrace", label: "Mid-terrace" },
  { value: "enclosed end-terrace", label: "Enclosed end-terrace" },
  { value: "enclosed mid-terrace", label: "Enclosed mid-terrace" },
];

const FUEL_GROUP_OPTIONS = [
  { value: "gas", label: "Gas" },
  { value: "electricity", label: "Electricity" },
  { value: "oil", label: "Oil" },
  { value: "biomass", label: "Biomass" },
  { value: "coal", label: "Coal" },
  { value: "none", label: "None" },
];

const WALL_TYPE_OPTIONS = [
  { value: "cavity", label: "Cavity" },
  { value: "solid", label: "Solid" },
  { value: "timber_frame", label: "Timber frame" },
  { value: "system_built", label: "System built" },
  { value: "stone", label: "Stone" },
  { value: "park_home", label: "Park home" },
  { value: "unknown", label: "Unknown" },
];

const WALL_INSULATION_OPTIONS = [
  { value: "unknown", label: "Unknown" },
  { value: "none", label: "None" },
  { value: "partial", label: "Partial" },
  { value: "internal", label: "Internal" },
  { value: "external", label: "External" },
  { value: "filled_cavity", label: "Filled cavity" },
  { value: "insulated_as_built", label: "Insulated as built" },
];

const ROOF_TYPE_OPTIONS = [
  { value: "pitched", label: "Pitched" },
  { value: "flat", label: "Flat" },
  { value: "roof_room", label: "Roof room" },
  { value: "thatched", label: "Thatched" },
  { value: "dwelling_above", label: "Dwelling above" },
  { value: "unknown", label: "Unknown" },
];

const GLAZING_LEVEL_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "secondary", label: "Secondary" },
  { value: "double", label: "Double" },
  { value: "triple", label: "Triple" },
  { value: "high_performance", label: "High performance" },
];

const GLAZING_COVERAGE_OPTIONS = [
  { value: "unknown", label: "Unknown" },
  { value: "some", label: "Some" },
  { value: "partial", label: "Partial" },
  { value: "mostly", label: "Mostly" },
  { value: "full", label: "Full" },
];

// Advanced / optional dropdowns
const TENURE_OPTIONS = [
  { value: "owner-occupied", label: "Owner-occupied" },
  { value: "rented (private)", label: "Rented (private)" },
  { value: "rented (social)", label: "Rented (social)" },
  { value: "unknown", label: "Unknown" },
];

const FLOOR_TYPE_OPTIONS = [
  { value: "solid", label: "Solid" },
  { value: "suspended", label: "Suspended" },
  { value: "unknown", label: "Unknown" },
];

const FLOOR_INSULATION_OPTIONS = [
  { value: "unknown", label: "Unknown" },
  { value: "none", label: "None" },
  { value: "limited", label: "Limited" },
  { value: "insulated", label: "Insulated" },
];

const PV_OPTIONS = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
];

const SOL_WAT_OPTIONS = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
  { value: "unknown", label: "Unknown" },
];

const DHW_SYSTEM_OPTIONS = [
  { value: "boiler", label: "Boiler" },
  { value: "electric_immersion", label: "Electric immersion" },
  { value: "electric_instant", label: "Electric instant" },
  { value: "gas_instant", label: "Gas instant" },
  { value: "heat_pump", label: "Heat pump" },
  { value: "community", label: "Community" },
  { value: "solid_fuel", label: "Solid fuel" },
  { value: "other", label: "Other" },
];

const DHW_ENERGY_OPTIONS = [
  { value: "gas", label: "Gas" },
  { value: "electricity", label: "Electricity" },
  { value: "solid", label: "Solid" },
  { value: "community", label: "Community" },
  { value: "unknown", label: "Unknown" },
];

const GLAZING_QUALITY_OPTIONS = [
  { value: "old", label: "Old" },
  { value: "unknown", label: "Unknown" },
  { value: "modern", label: "Modern" },
  { value: "known", label: "Known" },
];

export interface FormPayload {
  features: Record<string, string | number>;
}

interface EnergyFormProps {
  onSubmit: (payload: FormPayload) => void;
  isLoading: boolean;
}

const EnergyForm = ({ onSubmit, isLoading }: EnergyFormProps) => {
  // Required fields
  const [pType, setPType] = useState("");
  const [bType, setBType] = useState("");
  const [area, setArea] = useState<number | "">("");
  const [buildingAge, setBuildingAge] = useState<number | "">("");

  const [fuelGroup, setFuelGroup] = useState("");
  const [hasBoiler, setHasBoiler] = useState(false);
  const [hasRadiators, setHasRadiators] = useState(false);
  const [hasTimeControl, setHasTimeControl] = useState(false);
  const [hasTempControl, setHasTempControl] = useState(false);
  const [hasRoomControl, setHasRoomControl] = useState(false);

  const [wallType, setWallType] = useState("");
  const [wallInsulation, setWallInsulation] = useState("");
  const [roofType, setRoofType] = useState("");
  const [roofInsulationMm, setRoofInsulationMm] = useState<number | "">("");
  const [glazingLevel, setGlazingLevel] = useState("");
  const [glazingCoverage, setGlazingCoverage] = useState("");

  // Optional / advanced fields
  const [tenure, setTenure] = useState("");
  const [floorType, setFloorType] = useState("");
  const [floorInsulation, setFloorInsulation] = useState("");
  const [hasAirHp, setHasAirHp] = useState(false);
  const [hasGroundHp, setHasGroundHp] = useState(false);
  const [isCommunityHeating, setIsCommunityHeating] = useState(false);
  const [pv, setPv] = useState("");
  const [solWat, setSolWat] = useState("");
  const [dhwSystem, setDhwSystem] = useState("");
  const [dhwEnergy, setDhwEnergy] = useState("");
  const [glazingQuality, setGlazingQuality] = useState("");

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<string[]>(["general"]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {};

    if (!pType) newErrors.p_type = true;
    if (!bType) newErrors.b_type = true;
    if (area === "" || area < 1) newErrors.area = true;
    if (buildingAge === "" || buildingAge < 0) newErrors.building_age = true;
    if (!fuelGroup) newErrors.fuel_group = true;
    if (!wallType) newErrors.wall_type = true;
    if (!wallInsulation) newErrors.wall_insulation = true;
    if (!roofType) newErrors.roof_type = true;
    if (roofInsulationMm === "" || roofInsulationMm < 0) newErrors.roof_insulation_mm = true;
    if (!glazingLevel) newErrors.glazing_level = true;
    if (!glazingCoverage) newErrors.glazing_coverage = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const sectionsToExpand: string[] = [];
      if (newErrors.p_type || newErrors.b_type || newErrors.area || newErrors.building_age) {
        sectionsToExpand.push("general");
      }
      if (newErrors.fuel_group) {
        sectionsToExpand.push("heating");
      }
      if (newErrors.wall_type || newErrors.wall_insulation || newErrors.roof_type ||
          newErrors.roof_insulation_mm || newErrors.glazing_level || newErrors.glazing_coverage) {
        sectionsToExpand.push("insulation");
      }
      setExpandedSections((prev) => [...new Set([...prev, ...sectionsToExpand])]);
    }

    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const features: Record<string, string | number> = {
      // Required
      p_type: pType,
      b_type: bType,
      area: area as number,
      building_age: buildingAge as number,

      fuel_group: fuelGroup,
      has_boiler: hasBoiler ? 1 : 0,
      has_radiators: hasRadiators ? 1 : 0,
      has_time_control: hasTimeControl ? 1 : 0,
      has_temp_control: hasTempControl ? 1 : 0,
      has_room_control: hasRoomControl ? 1 : 0,

      wall_type: wallType,
      wall_insulation: wallInsulation,
      roof_type: roofType,
      roof_insulation_mm: roofInsulationMm as number,
      glazing_level: glazingLevel,
      glazing_coverage: glazingCoverage,
    };

    // Optional – only include if the user filled them
    if (tenure) features.tenure = tenure;
    if (floorType) features.floor_type = floorType;
    if (floorInsulation) features.floor_insulation = floorInsulation;
    if (hasAirHp) features.has_air_hp = 1;
    if (hasGroundHp) features.has_ground_hp = 1;
    if (isCommunityHeating) features.is_community_heating = 1;
    if (pv) features.pv = pv;
    if (solWat) features.sol_wat = solWat;
    if (dhwSystem) features.dhw_system = dhwSystem;
    if (dhwEnergy) features.dhw_energy = dhwEnergy;
    if (glazingQuality) features.glazing_quality = glazingQuality;

    onSubmit({ features });
  };

  // Reusable select field
  const SelectField = ({
    label,
    fieldKey,
    value,
    onChange,
    options,
    required = false,
    tooltip,
    placeholder = "Select an option",
  }: {
    label: string;
    fieldKey: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
    required?: boolean;
    tooltip?: string;
    placeholder?: string;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center">
        <Label htmlFor={fieldKey} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {tooltip && <FormTooltip content={tooltip} />}
      </div>
      <Select
        value={value}
        onValueChange={(v) => {
          onChange(v);
          clearError(fieldKey);
        }}
      >
        <SelectTrigger
          id={fieldKey}
          className={`form-focus ${errors[fieldKey] ? "border-destructive animate-shake" : ""}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] bg-popover">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  // Reusable toggle field
  const ToggleField = ({
    label,
    checked,
    onChange,
    tooltip,
  }: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    tooltip?: string;
  }) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium cursor-pointer">{label}</Label>
        {tooltip && <FormTooltip content={tooltip} />}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
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
          {/* General */}
          <AccordionItem value="general" className="border-b border-border/50">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-eco flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">General</p>
                  <p className="text-sm text-muted-foreground">Property type, age, and size</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <SelectField
                  label="Property Type"
                  fieldKey="p_type"
                  value={pType}
                  onChange={setPType}
                  options={P_TYPE_OPTIONS}
                  required
                  tooltip="The category of your property"
                  placeholder="Select property type"
                />
                <SelectField
                  label="Building Type"
                  fieldKey="b_type"
                  value={bType}
                  onChange={setBType}
                  options={B_TYPE_OPTIONS}
                  required
                  tooltip="The structural type of your building"
                  placeholder="Select building type"
                />
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="area" className="text-sm font-medium">
                      Floor Area (m²)
                      <span className="text-destructive ml-1">*</span>
                    </Label>
                    <FormTooltip content="Total internal floor area of your property in square metres" />
                  </div>
                  <Input
                    id="area"
                    type="number"
                    min={1}
                    placeholder="e.g., 85"
                    value={area === "" ? "" : area}
                    onChange={(e) => {
                      const v = e.target.value === "" ? "" : Number(e.target.value);
                      setArea(v);
                      clearError("area");
                    }}
                    className={`form-focus ${errors.area ? "border-destructive animate-shake" : ""}`}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="building_age" className="text-sm font-medium">
                      Building Age (years)
                      <span className="text-destructive ml-1">*</span>
                    </Label>
                    <FormTooltip content="Approximate age of the building in years" />
                  </div>
                  <Input
                    id="building_age"
                    type="number"
                    min={0}
                    placeholder="e.g., 51"
                    value={buildingAge === "" ? "" : buildingAge}
                    onChange={(e) => {
                      const v = e.target.value === "" ? "" : Number(e.target.value);
                      setBuildingAge(v);
                      clearError("building_age");
                    }}
                    className={`form-focus ${errors.building_age ? "border-destructive animate-shake" : ""}`}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Heating */}
          <AccordionItem value="heating" className="border-b border-border/50">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-warning" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Heating</p>
                  <p className="text-sm text-muted-foreground">Fuel type and heating controls</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 pt-2">
                <SelectField
                  label="Fuel Type"
                  fieldKey="fuel_group"
                  value={fuelGroup}
                  onChange={setFuelGroup}
                  options={FUEL_GROUP_OPTIONS}
                  required
                  tooltip="The main fuel source for heating"
                  placeholder="Select fuel type"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ToggleField label="Has Boiler" checked={hasBoiler} onChange={setHasBoiler} />
                  <ToggleField label="Has Radiators" checked={hasRadiators} onChange={setHasRadiators} />
                  <ToggleField label="Has Time Control" checked={hasTimeControl} onChange={setHasTimeControl} tooltip="Programmer or timer for heating" />
                  <ToggleField label="Has Temperature Control" checked={hasTempControl} onChange={setHasTempControl} tooltip="Thermostat for temperature" />
                  <ToggleField label="Has Room Control" checked={hasRoomControl} onChange={setHasRoomControl} tooltip="Thermostatic radiator valves (TRVs)" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Insulation */}
          <AccordionItem value="insulation" className="border-b border-border/50">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Insulation</p>
                  <p className="text-sm text-muted-foreground">Walls, roof, and glazing</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <SelectField
                  label="Wall Type"
                  fieldKey="wall_type"
                  value={wallType}
                  onChange={setWallType}
                  options={WALL_TYPE_OPTIONS}
                  required
                  tooltip="Your wall construction type"
                  placeholder="Select wall type"
                />
                <SelectField
                  label="Wall Insulation"
                  fieldKey="wall_insulation"
                  value={wallInsulation}
                  onChange={setWallInsulation}
                  options={WALL_INSULATION_OPTIONS}
                  required
                  tooltip="Level of wall insulation"
                  placeholder="Select insulation type"
                />
                <SelectField
                  label="Roof Type"
                  fieldKey="roof_type"
                  value={roofType}
                  onChange={setRoofType}
                  options={ROOF_TYPE_OPTIONS}
                  required
                  tooltip="Your roof construction type"
                  placeholder="Select roof type"
                />
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="roof_insulation_mm" className="text-sm font-medium">
                      Roof Insulation (mm)
                      <span className="text-destructive ml-1">*</span>
                    </Label>
                    <FormTooltip content="Thickness of roof insulation in millimetres" />
                  </div>
                  <Input
                    id="roof_insulation_mm"
                    type="number"
                    min={0}
                    placeholder="e.g., 100"
                    value={roofInsulationMm === "" ? "" : roofInsulationMm}
                    onChange={(e) => {
                      const v = e.target.value === "" ? "" : Number(e.target.value);
                      setRoofInsulationMm(v);
                      clearError("roof_insulation_mm");
                    }}
                    className={`form-focus ${errors.roof_insulation_mm ? "border-destructive animate-shake" : ""}`}
                  />
                </div>
                <SelectField
                  label="Glazing Level"
                  fieldKey="glazing_level"
                  value={glazingLevel}
                  onChange={setGlazingLevel}
                  options={GLAZING_LEVEL_OPTIONS}
                  required
                  tooltip="Type of window glazing"
                  placeholder="Select glazing level"
                />
                <SelectField
                  label="Glazing Coverage"
                  fieldKey="glazing_coverage"
                  value={glazingCoverage}
                  onChange={setGlazingCoverage}
                  options={GLAZING_COVERAGE_OPTIONS}
                  required
                  tooltip="How much of the property has this glazing"
                  placeholder="Select coverage"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Advanced (optional) */}
          <AccordionItem value="advanced">
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Settings2 className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Advanced</p>
                  <p className="text-sm text-muted-foreground">Optional fields for a more accurate assessment</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <SelectField
                  label="Tenure"
                  fieldKey="tenure"
                  value={tenure}
                  onChange={setTenure}
                  options={TENURE_OPTIONS}
                  tooltip="Your ownership or rental status"
                  placeholder="Select tenure"
                />
                <SelectField
                  label="Floor Type"
                  fieldKey="floor_type"
                  value={floorType}
                  onChange={setFloorType}
                  options={FLOOR_TYPE_OPTIONS}
                  tooltip="Your floor construction type"
                  placeholder="Select floor type"
                />
                <SelectField
                  label="Floor Insulation"
                  fieldKey="floor_insulation"
                  value={floorInsulation}
                  onChange={setFloorInsulation}
                  options={FLOOR_INSULATION_OPTIONS}
                  tooltip="Level of floor insulation"
                  placeholder="Select floor insulation"
                />
                <SelectField
                  label="Solar PV"
                  fieldKey="pv"
                  value={pv}
                  onChange={setPv}
                  options={PV_OPTIONS}
                  tooltip="Does the property have solar photovoltaic panels?"
                  placeholder="Select option"
                />
                <SelectField
                  label="Solar Water Heating"
                  fieldKey="sol_wat"
                  value={solWat}
                  onChange={setSolWat}
                  options={SOL_WAT_OPTIONS}
                  tooltip="Solar thermal panels for hot water"
                  placeholder="Select option"
                />
                <SelectField
                  label="Hot Water System"
                  fieldKey="dhw_system"
                  value={dhwSystem}
                  onChange={setDhwSystem}
                  options={DHW_SYSTEM_OPTIONS}
                  tooltip="How hot water is produced"
                  placeholder="Select system"
                />
                <SelectField
                  label="Hot Water Energy"
                  fieldKey="dhw_energy"
                  value={dhwEnergy}
                  onChange={setDhwEnergy}
                  options={DHW_ENERGY_OPTIONS}
                  tooltip="Energy source for hot water"
                  placeholder="Select energy source"
                />
                <SelectField
                  label="Glazing Quality"
                  fieldKey="glazing_quality"
                  value={glazingQuality}
                  onChange={setGlazingQuality}
                  options={GLAZING_QUALITY_OPTIONS}
                  tooltip="Age and quality of window glazing"
                  placeholder="Select quality"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <ToggleField label="Has Air Source Heat Pump" checked={hasAirHp} onChange={setHasAirHp} />
                <ToggleField label="Has Ground Source Heat Pump" checked={hasGroundHp} onChange={setHasGroundHp} />
                <ToggleField label="Community Heating" checked={isCommunityHeating} onChange={setIsCommunityHeating} />
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
            {isLoading ? "Analysing..." : "Analyse My Home"}
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
