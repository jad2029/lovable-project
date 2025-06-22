
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    managerName: '',
    birthDate: '',
    profession: '',
    city: '',
    domiciliation: '',
    iban: '',
    accountNumber: '',
    bankCode: '',
    agencyCode: '',
    ribKey: '',
    bicCode: '',
    accountStatus: 'Actif',
    amount: '',
    email: '',
    password: ''
  });

  const [accessCode, setAccessCode] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAccessCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === '1234') {
      setStep(2);
      toast({
        title: "Accès autorisé",
        description: "Vous pouvez maintenant remplir le formulaire d'inscription.",
      });
    } else {
      toast({
        title: "Code d'accès incorrect",
        description: "Veuillez entrer le bon code d'accès.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Generate account details automatically
      const generatedData = {
        ...formData,
        accountNumber: `FR76 ${Math.random().toString().substr(2, 4)} ${Math.random().toString().substr(2, 4)} ${Math.random().toString().substr(2, 4)} ${Math.random().toString().substr(2, 4)} ${Math.random().toString().substr(2, 4)} ${Math.random().toString().substr(2, 2)}`,
        iban: `FR76${Math.random().toString().substr(2, 20)}`,
        bankCode: '30004',
        agencyCode: '00821',
        ribKey: Math.random().toString().substr(2, 2),
        bicCode: 'BNPAFRPP'
      };

      // Store user data in localStorage (in a real app, this would be Firebase)
      const userData = {
        ...generatedData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('bankUser', JSON.stringify(userData));
      
      toast({
        title: "Inscription réussie !",
        description: "Votre compte a été créé avec succès.",
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      toast({
        title: "Erreur lors de l'inscription",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-neuro-bg flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="neuro-card p-8">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center text-neuro-blue hover:text-neuro-purple transition-colors mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Link>
              <h1 className="text-3xl font-bold gradient-text">Accès Sécurisé</h1>
              <p className="text-gray-600 mt-2">Entrez le code d'accès pour continuer</p>
            </div>

            <form onSubmit={handleAccessCodeSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type={showAccessCode ? 'text' : 'password'}
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Code d'accès"
                  className="neuro-input w-full px-6 py-4 text-lg text-center tracking-widest"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowAccessCode(!showAccessCode)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showAccessCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-blue text-white py-4 rounded-2xl shadow-neuro hover:shadow-neuro-pressed transition-all font-semibold"
              >
                Valider l'accès
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Code de démonstration : 1234</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neuro-bg py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="neuro-card p-8">
          <div className="text-center mb-8">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center text-neuro-blue hover:text-neuro-purple transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </button>
            <h1 className="text-4xl font-bold gradient-text mb-2">Ouvrir un compte</h1>
            <p className="text-gray-600">Remplissez tous les champs pour créer votre compte NeuroBank</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Informations personnelles</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="neuro-input w-full px-4 py-3"
                    placeholder="Votre nom complet"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom du Gestionnaire *</label>
                  <input
                    type="text"
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleInputChange}
                    className="neuro-input w-full px-4 py-3"
                    placeholder="Nom de votre gestionnaire"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance *</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="neuro-input w-full px-4 py-3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Métier *</label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    className="neuro-input w-full px-4 py-3"
                    placeholder="Votre profession"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="neuro-input w-full px-4 py-3"
                    placeholder="Votre ville"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Domiciliation *</label>
                  <input
                    type="text"
                    name="domiciliation"
                    value={formData.domiciliation}
                    onChange={handleInputChange}
                    className="neuro-input w-full px-4 py-3"
                    placeholder="Adresse complète"
                    required
                  />
                </div>
              </div>

              {/* Informations bancaires */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Informations bancaires</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut du compte</label>
                  <select
                    name="accountStatus"
                    value={formData.accountStatus}
                    onChange={handleInputChange}
                    className="neuro-input w-full px-4 py-3"
                  >
                    <option value="Actif">Actif</option>
                    <option value="En attente">En attente</option>
                    <option value="Suspendu">Suspendu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Montant initial *</label>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="neuro-input w-full px-4 py-3"
                    placeholder="Montant en €"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="neuro-input w-full px-4 py-3"
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="neuro-input w-full px-4 py-3 pr-12"
                    placeholder="Votre mot de passe"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-9 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="neuro-card p-4 bg-blue-50">
                  <h4 className="font-medium text-blue-800 mb-2">Informations générées automatiquement :</h4>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• IBAN : Généré automatiquement</li>
                    <li>• Numéro de compte : Attribué lors de la création</li>
                    <li>• Code banque : 30004</li>
                    <li>• Code agence : 00821</li>
                    <li>• Clé RIB : Calculée automatiquement</li>
                    <li>• Code BIC : BNPAFRPP</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6">
              <Link
                to="/"
                className="text-gray-600 hover:text-neuro-blue transition-colors"
              >
                Annuler
              </Link>
              
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-blue text-white px-8 py-3 rounded-2xl shadow-neuro hover:shadow-neuro-pressed transition-all font-semibold disabled:opacity-50 flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Création en cours...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Créer mon compte
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
