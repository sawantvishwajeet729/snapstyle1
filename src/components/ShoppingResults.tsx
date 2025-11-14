import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OutfitOption {
  image: string;
  description: string;
}

interface ShoppingResult {
  item: string;
  results: Array<{
    title: string;
    link: string;
    source: string;
  }>;
}

interface ShoppingResultsProps {
  outfit: OutfitOption;
  onBack: () => void;
}

const ShoppingResults = ({ outfit, onBack }: ShoppingResultsProps) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ShoppingResult[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    searchItems();
  }, [outfit]);

  const searchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("search-fashion", {
        body: { description: outfit.description }
      });

      if (error) throw error;

      setResults(data.results);
    } catch (error: any) {
      toast({
        title: "Search Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Options
      </Button>

      <Card className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={outfit.image}
              alt="Selected outfit"
              className="rounded-xl shadow-card w-full"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Your Selected Look</h2>
            <p className="text-muted-foreground leading-relaxed">{outfit.description}</p>
          </div>
        </div>
      </Card>

      {loading ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto" />
            <p className="text-muted-foreground">Finding the perfect pieces for you...</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-foreground">Shop These Items</h3>
          
          {results.map((item, index) => (
            <Card key={index} className="p-6">
              <h4 className="text-xl font-semibold text-foreground mb-4 capitalize">
                {item.item}
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {item.results.map((result, idx) => (
                  <a
                    key={idx}
                    href={result.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Card className="p-4 hover:shadow-card transition-all border-border group-hover:border-accent">
                      <div className="space-y-2">
                        <p className="font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
                          {result.title}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{result.source}</span>
                          <ExternalLink className="w-4 h-4 text-accent" />
                        </div>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingResults;
