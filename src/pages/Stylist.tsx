import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Sparkles, Upload, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import OutfitOptions from "@/components/OutfitOptions";
import ShoppingResults from "@/components/ShoppingResults";

interface OutfitOption {
  image: string;
  description: string;
}

type StylePreference = "Casual" | "Modern" | "Stylish" | "Traditional";

const Stylist = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [outfitOptions, setOutfitOptions] = useState<OutfitOption[]>([]);
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitOption | null>(null);
  const [stylePreference, setStylePreference] = useState<StylePreference>("Modern");
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setOutfitOptions([]);
        setSelectedOutfit(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-style", {
        body: { 
          image: selectedImage.split(",")[1],
          stylePreference 
        }
      });

      if (error) throw error;

      setOutfitOptions(data.outfits);
      toast({
        title: "Analysis Complete!",
        description: "Your personalized outfit options are ready.",
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            <span className="text-2xl font-bold">
              <span className="text-foreground">Snap</span>
              <span className="bg-gradient-vibrant bg-clip-text text-transparent">Style</span>
            </span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Your AI <span className="bg-gradient-accent bg-clip-text text-transparent">Style Assistant</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Upload your photo and discover your perfect style
            </p>
          </div>

          {/* Upload Section */}
          {!selectedImage && (
            <Card className="p-12 border-2 border-dashed border-border hover:border-accent transition-colors">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-10 h-10 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Upload Your Photo</h3>
                  <p className="text-muted-foreground">
                    Choose a clear, well-lit photo for the best results
                  </p>
                </div>
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Button size="lg" className="bg-charcoal hover:bg-charcoal/90 text-pearl pointer-events-none">
                    <Upload className="w-5 h-5 mr-2" />
                    Select Image
                  </Button>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </Card>
          )}

          {/* Image Preview & Analysis */}
          {selectedImage && !selectedOutfit && (
            <div className="space-y-8">
              <Card className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <img
                      src={selectedImage}
                      alt="Your photo"
                      className="rounded-xl shadow-card w-full"
                    />
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-3xl font-bold text-foreground">Ready to Analyze</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Our AI will analyze your photo to identify your skin tone, face shape, 
                      and body proportions. Then it will generate three personalized outfit 
                      suggestions tailored just for you.
                    </p>
                    
                    {/* Style Preference Selection */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">Choose Your Style</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(["Casual", "Modern", "Stylish", "Traditional"] as StylePreference[]).map((style) => (
                          <Button
                            key={style}
                            variant={stylePreference === style ? "default" : "outline"}
                            onClick={() => setStylePreference(style)}
                            className={stylePreference === style ? "bg-charcoal hover:bg-charcoal/90 text-pearl" : ""}
                          >
                            {style}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Button
                        size="lg"
                        onClick={analyzeImage}
                        disabled={analyzing}
                        className="w-full bg-charcoal hover:bg-charcoal/90 text-pearl"
                      >
                        {analyzing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Analyze My Style
                          </>
                        )}
                      </Button>
                      <label htmlFor="image-upload-change" className="cursor-pointer w-full block">
                        <Button variant="outline" className="w-full pointer-events-none" disabled={analyzing}>
                          Change Photo
                        </Button>
                      </label>
                      <input
                        id="image-upload-change"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {outfitOptions.length > 0 && (
                <OutfitOptions
                  options={outfitOptions}
                  onSelect={setSelectedOutfit}
                />
              )}
            </div>
          )}

          {/* Shopping Results */}
          {selectedOutfit && (
            <ShoppingResults
              outfit={selectedOutfit}
              onBack={() => setSelectedOutfit(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Stylist;
