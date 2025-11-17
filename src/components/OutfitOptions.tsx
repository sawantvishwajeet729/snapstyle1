import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

interface OutfitOption {
  image: string;
  description: string;
}

interface OutfitOptionsProps {
  options: OutfitOption[];
  onSelect: (outfit: OutfitOption) => void;
}

const OutfitOptions = ({ options, onSelect }: OutfitOptionsProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground text-center">
        Your Personalized <span className="bg-gradient-accent bg-clip-text text-transparent">Style Options</span>
      </h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {options.map((option, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-elegant transition-all group">
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src={option.image}
                alt={`Outfit option ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-accent">{index + 1}</span>
                </div>
                <h3 className="font-semibold text-foreground">Option {index + 1}</h3>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-1">
                {(() => {
                  try {
                    const desc = JSON.parse(option.description);
                    return Object.entries(desc).map(([key, value]) => (
                      <p key={key} className="line-clamp-2">
                        <span className="font-medium text-foreground">{key}:</span> {value as string}
                      </p>
                    ));
                  } catch {
                    return <p className="line-clamp-3">{option.description}</p>;
                  }
                })()}
              </div>
              <Button
                onClick={() => onSelect(option)}
                className="w-full bg-charcoal hover:bg-charcoal/90 text-pearl"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Shop This Look
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OutfitOptions;
