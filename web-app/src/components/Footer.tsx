import { Leaf, ExternalLink, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto py-8 bg-accent text-accent-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5" />
            <span className="text-sm">
              Based on UK EPC data standards
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.gov.uk/find-energy-certificate"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm hover:underline transition-all"
            >
              Learn More
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-1 text-sm">
            Made with <Heart className="w-4 h-4 text-destructive animate-pulse" /> for a greener future
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-accent-foreground/20 text-center">
          <p className="text-xs text-accent-foreground/70">
            © {new Date().getFullYear()} Home Energy Efficiency Advisor. 
            This tool provides estimates only and should not replace professional energy assessments.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
