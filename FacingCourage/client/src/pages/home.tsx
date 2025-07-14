import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Users, Target, Crown, Menu, X } from "lucide-react";
import ApplicationForm from "@/components/application-form";
import ApplicationStatus from "@/components/application-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const { data: applications } = useQuery({
    queryKey: ["/api/applications"],
  });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--dark-bg)] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--dark-bg)]/95 backdrop-blur-sm border-b border-[var(--gta-orange)]/20">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="gta-header text-2xl md:text-3xl">
              Face the Fear
            </div>
            <div className="hidden md:flex space-x-8">
              <button 
                onClick={() => scrollToSection("about")}
                className="text-white hover:text-[var(--gta-orange)] transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection("application")}
                className="text-white hover:text-[var(--gta-orange)] transition-colors"
              >
                Apply
              </button>
              <button 
                onClick={() => scrollToSection("contact")}
                className="text-white hover:text-[var(--gta-orange)] transition-colors"
              >
                Contact
              </button>
              <a 
                href="/admin/login"
                className="text-white hover:text-[var(--gta-orange)] transition-colors"
              >
                Admin
              </a>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:text-[var(--gta-orange)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-[var(--gta-orange)]/20">
              <div className="flex flex-col space-y-4 mt-4">
                <button 
                  onClick={() => scrollToSection("about")}
                  className="text-white hover:text-[var(--gta-orange)] transition-colors text-left"
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection("application")}
                  className="text-white hover:text-[var(--gta-orange)] transition-colors text-left"
                >
                  Apply
                </button>
                <button 
                  onClick={() => scrollToSection("contact")}
                  className="text-white hover:text-[var(--gta-orange)] transition-colors text-left"
                >
                  Contact
                </button>
                <a 
                  href="/admin/login"
                  className="text-white hover:text-[var(--gta-orange)] transition-colors text-left"
                >
                  Admin
                </a>
              </div>
            </div>
          )}
        </nav>
      </header>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-[var(--dark-bg)]/50 to-[var(--dark-bg)]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="gta-header text-5xl md:text-7xl lg:text-8xl mb-6">
              Face the Fear
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 font-[Orbitron]">
              Elite Gaming Faction • Dominate the Streets • Rise Above the Rest
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                className="gta-button px-8 py-4 text-lg"
                onClick={() => scrollToSection("application")}
              >
                JOIN THE FACTION
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-[var(--gta-orange)] text-[var(--gta-orange)] px-8 py-4 font-[Orbitron] text-lg hover:bg-[var(--gta-orange)] hover:text-black"
                onClick={() => scrollToSection("about")}
              >
                LEARN MORE
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* About Section */}
      <section id="about" className="py-20 bg-[var(--dark-surface)]/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-[Orbitron] font-bold text-[var(--gta-orange)] mb-6">
              ABOUT THE FACTION
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Face the Fear is an elite gaming faction dedicated to dominating the virtual streets. 
              We're not just a clan – we're a brotherhood built on respect, skill, and unwavering loyalty.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="faction-card p-8">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-[var(--gta-orange)] rounded-lg flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-[Orbitron] font-bold text-[var(--gta-gold)] mb-4">ELITE STANDARDS</h3>
                <p className="text-gray-300">
                  We maintain the highest standards of gameplay and conduct. Only the most skilled and dedicated players earn their place in our ranks.
                </p>
              </CardContent>
            </Card>

            <Card className="faction-card p-8">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-[var(--gta-orange)] rounded-lg flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-[Orbitron] font-bold text-[var(--gta-gold)] mb-4">BROTHERHOOD</h3>
                <p className="text-gray-300">
                  More than teammates, we're family. We watch each other's backs in-game and support our members through thick and thin.
                </p>
              </CardContent>
            </Card>

            <Card className="faction-card p-8">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-[var(--gta-orange)] rounded-lg flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-[Orbitron] font-bold text-[var(--gta-gold)] mb-4">DOMINATION</h3>
                <p className="text-gray-300">
                  We don't just play games – we dominate them. Our coordinated strategies and superior teamwork make us unstoppable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Application Section */}
      <section id="application" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-[Orbitron] font-bold text-[var(--gta-orange)] mb-6">
              JOIN THE RANKS
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Think you have what it takes? Submit your application and prove your worth. 
              Only the most dedicated will earn their place in Face the Fear.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Application Form */}
              <ApplicationForm />

              {/* Application Status & Info */}
              <div className="space-y-8">
                <ApplicationStatus />
                
                {/* Requirements */}
                <Card className="faction-card p-8">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-[Orbitron] font-bold text-[var(--gta-gold)] mb-6">REQUIREMENTS</h3>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-[var(--gta-orange)] mr-3 mt-0.5 flex-shrink-0" />
                        <span>Active Discord presence required</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-[var(--gta-orange)] mr-3 mt-0.5 flex-shrink-0" />
                        <span>Minimum 10 hours/week availability</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-[var(--gta-orange)] mr-3 mt-0.5 flex-shrink-0" />
                        <span>Respect for faction rules and hierarchy</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-[var(--gta-orange)] mr-3 mt-0.5 flex-shrink-0" />
                        <span>Competitive gaming experience preferred</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[var(--dark-surface)]/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-[Orbitron] font-bold text-[var(--gta-orange)] mb-6">
              CONTACT US
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Got questions? Need more information? Reach out to our leadership team.
            </p>
          </div>

          <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
            <Card className="faction-card p-8 text-center">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-[var(--gta-orange)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-[Orbitron] font-bold text-[var(--gta-gold)] mb-2">Discord</h3>
                <p className="text-gray-300 mb-4">Main communication hub</p>
                <a href="https://discord.gg/yuME7MxGgA" className="text-[var(--gta-orange)] hover:text-[var(--gta-gold)] transition-colors font-medium">
                  discord.gg/yuME7MxGgA
                </a>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <Card className="faction-card p-8 max-w-3xl mx-auto">
              <CardContent className="p-0">
                <h3 className="text-2xl font-[Orbitron] font-bold text-[var(--gta-gold)] mb-4">FACTION LEADERSHIP</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[var(--gta-orange)] rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Crown className="w-6 h-6 text-black" />
                    </div>
                    <h4 className="font-[Orbitron] font-bold text-white">ShadowLeader</h4>
                    <p className="text-sm text-gray-400">Beelzebub
</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[var(--gta-gold)] rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Target className="w-6 h-6 text-black" />
                    </div>
                    <h4 className="font-[Orbitron] font-bold text-white">WarCommander</h4>
                    <p className="text-sm text-gray-400">Glitch</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[var(--gta-gold)] rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-black" />
                    </div>
                    <h4 className="font-[Orbitron] font-bold text-white">RecruitMaster</h4>
                    <p className="text-sm text-gray-400">Vesho</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-[var(--dark-bg)] border-t border-[var(--gta-orange)]/20 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="gta-header text-3xl mb-4">Face the Fear</div>
            <p className="text-gray-400 mb-6">Elite Gaming Faction • Est. 2023</p>

            <div className="mt-8 text-gray-500 text-sm">
              © 2025 Face the Fear Gaming Faction. All rights reserved.
            </div>
            <div className="mt-2 text-gray-400 text-sm">
              Made by <span className="text-[var(--gta-orange)] font-medium">Glitch</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
