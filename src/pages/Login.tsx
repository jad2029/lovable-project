
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation d'une authentification
    setTimeout(() => {
      const userData = localStorage.getItem('bankUser');
      
      if (userData) {
        const user = JSON.parse(userData);
        
        if (user.email === formData.email && user.password === formData.password) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', JSON.stringify(user));
          
          toast({
            title: "Connexion réussie !",
            description: `Bienvenue ${user.fullName}`,
          });

          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          toast({
            title: "Identifiants incorrects",
            description: "Email ou mot de passe incorrect",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Compte non trouvé",
          description: "Veuillez d'abord créer un compte",
          variant: "destructive"
        });
      }
      
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-neuro-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="neuro-card p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center text-neuro-blue hover:text-neuro-purple transition-colors mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Link>
            
            <div className="w-20 h-20 bg-gradient-blue rounded-3xl shadow-neuro mx-auto mb-6 flex items-center justify-center">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold gradient-text mb-2">Connexion</h1>
            <p className="text-gray-600">Accédez à votre espace NeuroBank</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse e-mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="neuro-input w-full px-4 py-4 text-lg"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="neuro-input w-full px-4 py-4 pr-12 text-lg"
                placeholder="Votre mot de passe"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-11 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-neuro-blue bg-neuro-bg border border-gray-300 rounded focus:ring-neuro-blue focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <button type="button" className="text-sm text-neuro-blue hover:text-neuro-purple transition-colors">
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-blue text-white py-4 rounded-2xl shadow-neuro hover:shadow-neuro-pressed transition-all font-semibold text-lg disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Connexion en cours...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-neuro-bg text-gray-500">Nouveau client ?</span>
              </div>
            </div>
            
            <Link
              to="/signup"
              className="mt-4 w-full neuro-button py-4 text-gray-700 hover:text-neuro-blue transition-all font-semibold flex items-center justify-center"
            >
              Ouvrir un compte
            </Link>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
            <p className="text-sm text-blue-600 text-center">
              <strong>Compte de démonstration :</strong><br />
              Email : test@neurobank.com<br />
              Mot de passe : demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
