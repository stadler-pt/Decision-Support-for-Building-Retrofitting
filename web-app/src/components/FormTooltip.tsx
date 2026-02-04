import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FormTooltipProps {
  content: string;
}

const FormTooltip = ({ content }: FormTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted hover:bg-primary/10 transition-colors ml-1"
        >
          <Info className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs animate-fade-in">
        <p className="text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default FormTooltip;
