
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Smartphone, CreditCard, TrendingUp, Users, Award } from 'lucide-react';

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const heroSlides = [
    {
      title: "L'avenir de la banque est ici",
      subtitle: "Découvrez une expérience bancaire révolutionnaire avec notre technologie de pointe",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop"
    },
    {
      title: "Sécurité maximale, simplicité totale",
      subtitle: "Profitez d'un système bancaire ultra-sécurisé avec une interface intuitive",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop"
    },
    {
      title: "Votre argent, vos règles",
      subtitle: "Gérez vos finances avec une liberté et un contrôle total",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Sécurité Avancée",
      description: "Protection maximale avec cryptage quantique et biométrie"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Application entièrement optimisée pour mobile et desktop"
    },
    {
      icon: CreditCard,
      title: "Cartes Intelligentes",
      description: "Cartes virtuelles et physiques avec contrôle en temps réel"
    },
    {
      icon: TrendingUp,
      title: "Analytics IA",
      description: "Analyses financières personnalisées par intelligence artificielle"
    }
  ];

  return (
    <div className="min-h-screen bg-neuro-bg">
      {/* Header */}
      <header className="relative z-50 px-4 py-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-blue rounded-2xl shadow-neuro flex items-center justify-center">
              <span className="text-white font-bold text-xl">NB</span>
            </div>
            <span className="text-2xl font-bold gradient-text">NeuroBank</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-gray-600 hover:text-neuro-blue transition-colors">Services</a>
            <a href="#about" className="text-gray-600 hover:text-neuro-blue transition-colors">À propos</a>
            <a href="#contact" className="text-gray-600 hover:text-neuro-blue transition-colors">Contact</a>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="neuro-button px-6 py-3 text-gray-700 hover:text-neuro-blue transition-all">
              Connexion
            </Link>
            <Link to="/signup" className="bg-gradient-blue text-white px-6 py-3 rounded-2xl shadow-neuro hover:shadow-neuro-pressed transition-all">
              Ouvrir un compte
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="gradient-text">{heroSlides[currentSlide].title}</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="group bg-gradient-blue text-white px-8 py-4 rounded-2xl shadow-neuro hover:shadow-neuro-pressed transition-all flex items-center justify-center">
                  Commencer maintenant
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="neuro-button px-8 py-4 text-gray-700 hover:text-neuro-blue transition-all">
                  Découvrir nos services
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="neuro-card p-8 animate-float">
                <img 
                  src={heroSlides[currentSlide].image} 
                  alt="Banking illustration" 
                  className="w-full h-80 object-cover rounded-2xl"
                />
              </div>
              
              {/* Slide indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide ? 'bg-neuro-blue shadow-neuro' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold gradient-text mb-4">Pourquoi choisir NeuroBank ?</h2>
            <p className="text-xl text-gray-600">Une expérience bancaire révolutionnaire à portée de main</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="neuro-card p-8 text-center hover:shadow-neuro-pressed transition-all group">
                <div className="w-16 h-16 bg-gradient-blue rounded-2xl shadow-neuro mx-auto mb-6 flex items-center justify-center group-hover:animate-pulse-neuro">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-neuro-blue to-neuro-purple">
        <div className="max-w-7xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-16">Nos chiffres parlent d'eux-mêmes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="text-5xl font-bold">2M+</div>
              <div className="text-xl">Clients satisfaits</div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-bold">150+</div>
              <div className="text-xl">Pays desservis</div>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-bold">99.9%</div>
              <div className="text-xl">Disponibilité</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="neuro-card p-12">
            <h2 className="text-4xl font-bold gradient-text mb-6">Prêt à rejoindre l'avenir de la banque ?</h2>
            <p className="text-xl text-gray-600 mb-8">Ouvrez votre compte en quelques minutes et découvrez une nouvelle façon de gérer votre argent.</p>
            <Link to="/signup" className="inline-block bg-gradient-blue text-white px-12 py-4 rounded-2xl shadow-neuro hover:shadow-neuro-pressed transition-all text-lg font-semibold">
              Ouvrir mon compte gratuitement
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-blue rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">NB</span>
                </div>
                <span className="text-xl font-bold">NeuroBank</span>
              </div>
              <p className="text-gray-400">La banque du futur, disponible aujourd'hui.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Comptes bancaires</li>
                <li>Cartes de crédit</li>
                <li>Prêts personnels</li>
                <li>Investissements</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Centre d'aide</li>
                <li>Contact</li>
                <li>Sécurité</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Conditions d'utilisation</li>
                <li>Politique de confidentialité</li>
                <li>Mentions légales</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 NeuroBank. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
