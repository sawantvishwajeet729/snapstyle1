import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Camera, ShoppingBag } from "lucide-react";
import heroImage from "@/assets/hero-fashion.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            <span className="text-2xl font-bold text-foreground">SnapStyle</span>
          </Link>
          <div className="flex gap-6 items-center">
            <Link to="/" className="text-foreground hover:text-accent transition-colors">
              Home
            </Link>
            <Link to="/stylist" className="text-foreground hover:text-accent transition-colors">
              Try It
            </Link>
            <Link to="/contact" className="text-foreground hover:text-accent transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">AI-Powered Fashion</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                Your Personal
                <span className="bg-gradient-accent bg-clip-text text-transparent"> AI Stylist</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Upload your photo and let our advanced AI analyze your unique features to suggest 
                personalized fashion choices that complement your style.
              </p>
              
              <div className="flex gap-4">
                <Link to="/stylist">
                  <Button size="lg" className="bg-charcoal hover:bg-charcoal/90 text-pearl shadow-elegant">
                    <Camera className="w-5 h-5 mr-2" />
                    Start Styling
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-border hover:bg-muted">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-accent opacity-20 blur-3xl rounded-full"></div>
              <img 
                src={heroImage} 
                alt="Fashion styling showcase" 
                className="relative rounded-2xl shadow-elegant w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Three simple steps to your perfect style</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-card border border-border hover:shadow-elegant transition-all">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                <Camera className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">1. Upload Photo</h3>
              <p className="text-muted-foreground leading-relaxed">
                Simply upload a clear photo of yourself. Our AI will analyze your unique features including 
                skin tone, face shape, and body proportions.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-card border border-border hover:shadow-elegant transition-all">
              <div className="w-14 h-14 bg-sage/10 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-sage" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">2. AI Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our advanced AI creates three personalized outfit suggestions with detailed descriptions 
                and visual representations.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl shadow-card border border-border hover:shadow-elegant transition-all">
              <div className="w-14 h-14 bg-rose-gold/10 rounded-xl flex items-center justify-center mb-6">
                <ShoppingBag className="w-7 h-7 text-rose-gold" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">3. Shop Items</h3>
              <p className="text-muted-foreground leading-relaxed">
                Select your favorite look and get direct shopping links to find each piece, 
                making it easy to build your new wardrobe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-hero rounded-3xl p-12 lg:p-20 text-center shadow-elegant">
            <h2 className="text-4xl lg:text-5xl font-bold text-pearl mb-6">
              Ready to Transform Your Style?
            </h2>
            <p className="text-xl text-pearl/80 mb-8 max-w-2xl mx-auto">
              Join thousands of users who've discovered their perfect style with our AI-powered fashion assistant.
            </p>
            <Link to="/stylist">
              <Button size="lg" className="bg-pearl text-charcoal hover:bg-pearl/90 shadow-elegant text-lg px-8">
                <Camera className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-xl font-bold text-foreground">SnapStyle</span>
          </div>
          <p className="text-muted-foreground">
            © 2025 SnapStyle. Your AI-powered fashion companion.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
