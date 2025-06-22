import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  User, 
  LogOut, 
  Home, 
  CreditCard, 
  Users, 
  ArrowUpRight, 
  History, 
  Settings,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Download,
  X,
  Check,
  Camera,
  Menu
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  fullName: string;
  email: string;
  birthDate: string;
  profession: string;
  city: string;
  domiciliation: string;
  amount: string;
  accountStatus: string;
  iban: string;
  accountNumber: string;
  bankCode: string;
  agencyCode: string;
  ribKey: string;
  bicCode: string;
  managerName: string;
  profilePhoto?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showBalance, setShowBalance] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [transferStep, setTransferStep] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<Partial<UserProfile>>({});
  const [transferForm, setTransferForm] = useState({
    beneficiaryName: '',
    accountNumber: '',
    bankName: '',
    bicCode: '',
    reason: '',
    country: '',
    amount: '',
    secretCode: ''
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || !currentUser) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(currentUser) as UserProfile;
    setUser(userData);
    setProfileForm(userData);
    
    // Load saved data
    const savedBeneficiaries = localStorage.getItem('beneficiaries');
    const savedTransfers = localStorage.getItem('transfers');
    const savedNotifications = localStorage.getItem('notifications');
    
    if (savedBeneficiaries) setBeneficiaries(JSON.parse(savedBeneficiaries));
    if (savedTransfers) setTransfers(JSON.parse(savedTransfers));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    
    // Update date every minute
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
    navigate('/');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const countries = [
    'France', 'Allemagne', 'Espagne', 'Italie', 'Royaume-Uni', 'Belgique', 'Suisse', 'Canada', 
    'États-Unis', 'Japon', 'Australie', 'Brésil', 'Inde', 'Chine', 'Russie', 'Maroc', 
    'Tunisie', 'Algérie', 'Sénégal', 'Côte d\'Ivoire', 'Cameroun', 'Nigeria', 'Ghana',
    'Portugal', 'Pays-Bas', 'Autriche', 'Norvège', 'Suède', 'Danemark', 'Finlande',
    'Pologne', 'République tchèque', 'Hongrie', 'Roumanie', 'Bulgarie', 'Grèce',
    'Turquie', 'Égypte', 'Afrique du Sud', 'Kenya', 'Éthiopie', 'Tanzanie',
    'Argentine', 'Chili', 'Colombie', 'Pérou', 'Venezuela', 'Mexique'
  ];

  // Function to generate PDF receipt
  const downloadTransferReceipt = (transfer: any) => {
    const receiptContent = `
      REÇU DE VIREMENT
      ================
      
      Date: ${new Date(transfer.date).toLocaleDateString('fr-FR')}
      Montant: ${transfer.amount}€
      Bénéficiaire: ${transfer.beneficiaryName}
      Banque: ${transfer.bankName}
      Pays: ${transfer.country}
      Motif: ${transfer.reason}
      Code BIC: ${transfer.bicCode}
      Statut: ${transfer.status}
      
      NeuroBank - Reçu de transaction
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recu_virement_${transfer.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Function to download RIB as PDF
  const downloadRIB = () => {
    if (!user) return;
    
    const ribContent = `
      RELEVÉ D'IDENTITÉ BANCAIRE (RIB)
      ================================
      
      Titulaire: ${user.fullName}
      IBAN: ${user.iban}
      Numéro de compte: ${user.accountNumber}
      Code banque: ${user.bankCode}
      Code agence: ${user.agencyCode}
      Clé RIB: ${user.ribKey}
      Code BIC: ${user.bicCode}
      Domiciliation: ${user.domiciliation}
      
      NeuroBank - RIB Officiel
    `;
    
    const blob = new Blob([ribContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RIB_${user.fullName.replace(' ', '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Function to cancel transfer
  const cancelTransfer = (transferId: number) => {
    const reason = prompt('Pourquoi annulez-vous ce virement ?');
    if (!reason) return;

    const updatedTransfers = transfers.map((transfer: any) => 
      transfer.id === transferId 
        ? { ...transfer, status: 'Annulé', cancelReason: reason }
        : transfer
    );
    setTransfers(updatedTransfers);
    localStorage.setItem('transfers', JSON.stringify(updatedTransfers));
    
    toast({
      title: "Virement annulé",
      description: "Le virement a été annulé avec succès",
    });
  };

  const handleTransferSubmit = () => {
    if (transferStep === 1) {
      setTransferStep(2);
    } else if (transferStep === 2) {
      setTransferStep(3);
    } else if (transferStep === 3) {
      if (transferForm.secretCode === '1492') {
        // Update user balance
        const updatedUser = {
          ...user!,
          amount: (parseFloat(user!.amount) - parseFloat(transferForm.amount)).toString()
        };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Add notification
        const newNotification = {
          id: Date.now(),
          type: 'transfer',
          message: `Virement de ${transferForm.amount}€ vers ${transferForm.beneficiaryName}`,
          date: new Date().toISOString(),
          details: transferForm
        };
        
        const updatedNotifications = [...notifications, newNotification];
        setNotifications(updatedNotifications);
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        
        // Add to transfers history
        const newTransfer = {
          id: Date.now(),
          ...transferForm,
          date: new Date().toISOString(),
          status: 'En cours'
        };
        
        const updatedTransfers = [...transfers, newTransfer];
        setTransfers(updatedTransfers);
        localStorage.setItem('transfers', JSON.stringify(updatedTransfers));
        
        toast({
          title: "Virement confirmé",
          description: "Votre virement a été enregistré avec succès",
        });
        
        setActiveMenu('history');
        setTransferStep(1);
        setTransferForm({
          beneficiaryName: '',
          accountNumber: '',
          bankName: '',
          bicCode: '',
          reason: '',
          country: '',
          amount: '',
          secretCode: ''
        });
      } else {
        toast({
          title: "Code incorrect",
          description: "Le code secret saisi est incorrect",
          variant: "destructive"
        });
      }
    }
  };

  const handleProfileUpdate = () => {
    const updatedUser = { ...user!, ...profileForm };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setIsEditingProfile(false);
    
    toast({
      title: "Profil mis à jour",
      description: "Vos modifications ont été sauvegardées",
    });
  };

  const handleProfilePhotoUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target?.result as string;
        const updatedUser = { ...user!, profilePhoto: photoUrl };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        toast({
          title: "Photo mise à jour",
          description: "Votre photo de profil a été mise à jour",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-neuro-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-neuro-blue"></div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'accounts', label: 'Comptes', icon: CreditCard },
    { id: 'cards', label: 'Mes cartes', icon: CreditCard },
    { id: 'beneficiaries', label: 'Bénéficiaires', icon: Users },
    { id: 'transfer', label: 'Virement', icon: ArrowUpRight },
    { id: 'rib', label: 'RIB', icon: Settings },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'manager', label: 'Gestionnaire', icon: User },
    { id: 'history', label: 'Historique', icon: History },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Balance Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="neuro-card p-6 bg-gradient-blue text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Solde Principal</h3>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
                <div className="text-3xl font-bold mb-2">
                  {showBalance ? `${user.amount}€` : '••••••'}
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    user.accountStatus === 'Actif' ? 'bg-green-400' : 'bg-yellow-400'
                  }`}></div>
                  <span className="text-white/90 text-sm">{user.accountStatus}</span>
                </div>
              </div>

              <div className="neuro-card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Compte Épargne</h3>
                <div className="text-2xl font-bold text-green-600">
                  {showBalance ? `${(parseFloat(user.amount) * 0.1).toFixed(2)}€` : '••••••'}
                </div>
                <p className="text-gray-600 mt-2">Livret A</p>
              </div>

              <div className="neuro-card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Assurance Vie</h3>
                <div className="text-2xl font-bold text-blue-600">
                  {showBalance ? `${(parseFloat(user.amount) * 0.5).toFixed(2)}€` : '••••••'}
                </div>
                <p className="text-gray-600 mt-2">Contrat premium</p>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="neuro-card p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Transactions récentes</h3>
              <div className="space-y-3">
                {transfers.slice(-3).map((transfer) => (
                  <div key={transfer.id} className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <ArrowUpRight className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Virement vers {transfer.beneficiaryName}</p>
                        <p className="text-sm text-gray-600">{new Date(transfer.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    <span className="text-red-600 font-semibold">-{transfer.amount}€</span>
                  </div>
                ))}
                
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Virement reçu</p>
                      <p className="text-sm text-gray-600">Il y a 2 jours</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold">+500€</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'accounts':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold gradient-text">Mes Comptes</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="neuro-card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Compte Courant</h3>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {showBalance ? `${user.amount}€` : '••••••'}
                </div>
                <p className="text-gray-600">Compte principal</p>
                <div className="mt-4 flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    user.accountStatus === 'Actif' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-sm">{user.accountStatus}</span>
                </div>
              </div>

              <div className="neuro-card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Compte Épargne</h3>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {showBalance ? `${(parseFloat(user.amount) * 0.1).toFixed(2)}€` : '••••••'}
                </div>
                <p className="text-gray-600">Livret A - Taux 3%</p>
                <p className="text-sm text-gray-500 mt-2">Plafond: 22,950€</p>
              </div>

              <div className="neuro-card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Assurance Vie</h3>
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {showBalance ? `${(parseFloat(user.amount) * 0.5).toFixed(2)}€` : '••••••'}
                </div>
                <p className="text-gray-600">Contrat Premium</p>
                <p className="text-sm text-gray-500 mt-2">Rendement: 4.2%</p>
              </div>
            </div>
          </div>
        );

      case 'cards':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold gradient-text">Mes Cartes</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Carte Visa */}
              <div className="neuro-card p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                <div className="flex justify-between items-start mb-8">
                  <span className="text-lg font-bold">VISA</span>
                  <div className="w-8 h-8 bg-white/20 rounded"></div>
                </div>
                <div className="space-y-4">
                  <div className="text-lg font-mono tracking-wider">
                    4532 •••• •••• 1234
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-white/70">Titulaire</p>
                      <p className="font-semibold">{user.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/70">Expire</p>
                      <p className="font-semibold">12/28</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte Mastercard */}
              <div className="neuro-card p-6 bg-gradient-to-br from-red-600 to-red-800 text-white">
                <div className="flex justify-between items-start mb-8">
                  <span className="text-lg font-bold">MASTERCARD</span>
                  <div className="flex space-x-1">
                    <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                    <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-lg font-mono tracking-wider">
                    5555 •••• •••• 4444
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-white/70">Titulaire</p>
                      <p className="font-semibold">{user.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/70">Expire</p>
                      <p className="font-semibold">08/27</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte American Express */}
              <div className="neuro-card p-6 bg-gradient-to-br from-gray-700 to-gray-900 text-white">
                <div className="flex justify-between items-start mb-8">
                  <span className="text-lg font-bold">AMEX</span>
                  <div className="w-8 h-8 bg-white rounded"></div>
                </div>
                <div className="space-y-4">
                  <div className="text-lg font-mono tracking-wider">
                    3782 •••••• 12345
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-white/70">Titulaire</p>
                      <p className="font-semibold">{user.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/70">Expire</p>
                      <p className="font-semibold">03/29</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'beneficiaries':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold gradient-text">Bénéficiaires</h2>
              <button 
                onClick={() => {
                  const name = prompt('Nom du bénéficiaire:');
                  const iban = prompt('IBAN:');
                  if (name && iban) {
                    const newBeneficiary = {
                      id: Date.now(),
                      name,
                      iban,
                      dateAdded: new Date().toISOString()
                    };
                    const updated = [...beneficiaries, newBeneficiary];
                    setBeneficiaries(updated);
                    localStorage.setItem('beneficiaries', JSON.stringify(updated));
                  }
                }}
                className="bg-gradient-blue text-white px-4 py-2 rounded-2xl shadow-neuro hover:shadow-neuro-pressed transition-all flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </button>
            </div>
            
            <div className="space-y-4">
              {beneficiaries.length === 0 ? (
                <div className="neuro-card p-8 text-center">
                  <p className="text-gray-600">Aucun bénéficiaire enregistré</p>
                </div>
              ) : (
                beneficiaries.map((beneficiary) => (
                  <div key={beneficiary.id} className="neuro-card p-6 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{beneficiary.name}</h3>
                      <p className="text-gray-600 text-sm">{beneficiary.iban}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="neuro-button p-2 hover:text-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          const updated = beneficiaries.filter(b => b.id !== beneficiary.id);
                          setBeneficiaries(updated);
                          localStorage.setItem('beneficiaries', JSON.stringify(updated));
                        }}
                        className="neuro-button p-2 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'transfer':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold gradient-text">Effectuer un virement</h2>
            
            <div className="neuro-card p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className={`flex items-center ${step < 3 ? 'flex-1' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transferStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-300'
                      }`}>
                        {step}
                      </div>
                      {step < 3 && <div className={`flex-1 h-1 mx-4 ${
                        transferStep > step ? 'bg-blue-600' : 'bg-gray-300'
                      }`}></div>}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span>Informations</span>
                  <span>Montant</span>
                  <span>Confirmation</span>
                </div>
              </div>

              {transferStep === 1 && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom du bénéficiaire</label>
                      <input
                        type="text"
                        value={transferForm.beneficiaryName}
                        onChange={(e) => setTransferForm({...transferForm, beneficiaryName: e.target.value})}
                        className="neuro-input w-full px-4 py-3"
                        placeholder="Nom complet"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de compte</label>
                      <input
                        type="text"
                        value={transferForm.accountNumber}
                        onChange={(e) => setTransferForm({...transferForm, accountNumber: e.target.value})}
                        className="neuro-input w-full px-4 py-3"
                        placeholder="IBAN du bénéficiaire"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la banque</label>
                      <input
                        type="text"
                        value={transferForm.bankName}
                        onChange={(e) => setTransferForm({...transferForm, bankName: e.target.value})}
                        className="neuro-input w-full px-4 py-3"
                        placeholder="Banque du bénéficiaire"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Code BIC</label>
                      <input
                        type="text"
                        value={transferForm.bicCode}
                        onChange={(e) => setTransferForm({...transferForm, bicCode: e.target.value})}
                        className="neuro-input w-full px-4 py-3"
                        placeholder="Code BIC/SWIFT"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Motif du virement</label>
                      <input
                        type="text"
                        value={transferForm.reason}
                        onChange={(e) => setTransferForm({...transferForm, reason: e.target.value})}
                        className="neuro-input w-full px-4 py-3"
                        placeholder="Motif du transfert"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                      <select
                        value={transferForm.country}
                        onChange={(e) => setTransferForm({...transferForm, country: e.target.value})}
                        className="neuro-input w-full px-4 py-3"
                      >
                        <option value="">Sélectionner un pays</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {transferStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Montant du virement</label>
                    <input
                      type="text"
                      value={transferForm.amount}
                      onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})}
                      className="neuro-input w-full px-4 py-3 text-lg"
                      placeholder="0.00 €"
                    />
                  </div>
                  <div className="neuro-card p-4 bg-blue-50">
                    <h4 className="font-medium mb-2">Récapitulatif</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Bénéficiaire:</span>
                        <span>{transferForm.beneficiaryName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Banque:</span>
                        <span>{transferForm.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pays:</span>
                        <span>{transferForm.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Motif:</span>
                        <span>{transferForm.reason}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {transferStep === 3 && (
                <div className="space-y-4">
                  <div className="neuro-card p-4 bg-green-50">
                    <h4 className="font-medium mb-4">Confirmation du virement</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Montant:</span>
                        <span className="font-bold">{transferForm.amount} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vers:</span>
                        <span>{transferForm.beneficiaryName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frais:</span>
                        <span>0.00 €</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Code secret</label>
                    <input
                      type="password"
                      value={transferForm.secretCode}
                      onChange={(e) => setTransferForm({...transferForm, secretCode: e.target.value})}
                      className="neuro-input w-full px-4 py-3"
                      placeholder="Saisissez votre code secret"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-6">
                {transferStep > 1 && (
                  <button
                    onClick={() => setTransferStep(transferStep - 1)}
                    className="neuro-button px-6 py-3 text-gray-700"
                  >
                    Retour
                  </button>
                )}
                <button
                  onClick={handleTransferSubmit}
                  className="bg-gradient-blue text-white px-6 py-3 rounded-2xl shadow-neuro hover:shadow-neuro-pressed transition-all ml-auto"
                >
                  {transferStep === 3 ? 'Confirmer' : 'Suivant'}
                </button>
              </div>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold gradient-text">Historique des virements</h2>
            
            <div className="space-y-4">
              {transfers.length === 0 ? (
                <div className="neuro-card p-8 text-center">
                  <p className="text-gray-600">Aucun virement effectué</p>
                </div>
              ) : (
                transfers.map((transfer) => (
                  <div key={transfer.id} className="neuro-card p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{transfer.beneficiaryName}</h3>
                        <p className="text-gray-600">{transfer.bankName} - {transfer.country}</p>
                        <p className="text-sm text-gray-500">{new Date(transfer.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-600">-{transfer.amount}€</p>
                        <p className={`text-sm ${
                          transfer.status === 'Annulé' ? 'text-red-600' : 'text-orange-600'
                        }`}>{transfer.status}</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Motif:</span>
                        <span className="ml-2">{transfer.reason}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Code BIC:</span>
                        <span className="ml-2">{transfer.bicCode}</span>
                      </div>
                    </div>
                    
                    {transfer.cancelReason && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-700">
                          <strong>Motif d'annulation:</strong> {transfer.cancelReason}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => downloadTransferReceipt(transfer)}
                          className="neuro-button px-4 py-2 text-sm flex items-center"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Télécharger reçu
                        </button>
                        {transfer.status === 'En cours' ? (
                          <button 
                            onClick={() => cancelTransfer(transfer.id)}
                            className="neuro-button px-4 py-2 text-sm text-red-600 flex items-center"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Annuler
                          </button>
                        ) : transfer.status === 'Annulé' && (
                          <div className="neuro-button px-4 py-2 text-sm text-gray-600 flex items-center">
                            Message d'annulation
                          </div>
                        )}
                      </div>
                      
                      <div className="w-48 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            transfer.status === 'Annulé' ? 'bg-red-600' : 'bg-blue-600'
                          }`}
                          style={{ width: transfer.status === 'Annulé' ? '100%' : '66%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="neuro-card p-6">
            <h2 className="text-2xl font-bold gradient-text mb-6">Mon Profil</h2>
            <div className="flex items-center mb-6">
              <div className="relative">
                {user.profilePhoto ? (
                  <img 
                    src={user.profilePhoto} 
                    alt="Photo de profil" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-blue rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 neuro-button p-2 rounded-full cursor-pointer hover:text-blue-600">
                  <Camera className="w-4 h-4" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfilePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  {isEditingProfile ? (
                    <input 
                      type="text" 
                      value={profileForm.fullName || ''}
                      onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                      className="neuro-input w-full px-4 py-3"
                    />
                  ) : (
                    <p className="text-lg">{user.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditingProfile ? (
                    <input 
                      type="email" 
                      value={profileForm.email || ''}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      className="neuro-input w-full px-4 py-3"
                    />
                  ) : (
                    <p className="text-lg">{user.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                  {isEditingProfile ? (
                    <input 
                      type="date" 
                      value={profileForm.birthDate || ''}
                      onChange={(e) => setProfileForm({...profileForm, birthDate: e.target.value})}
                      className="neuro-input w-full px-4 py-3"
                    />
                  ) : (
                    <p className="text-lg">{user.birthDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                  {isEditingProfile ? (
                    <input 
                      type="text" 
                      value={profileForm.profession || ''}
                      onChange={(e) => setProfileForm({...profileForm, profession: e.target.value})}
                      className="neuro-input w-full px-4 py-3"
                    />
                  ) : (
                    <p className="text-lg">{user.profession}</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  {isEditingProfile ? (
                    <input 
                      type="text" 
                      value={profileForm.city || ''}
                      onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                      className="neuro-input w-full px-4 py-3"
                    />
                  ) : (
                    <p className="text-lg">{user.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Domiciliation</label>
                  {isEditingProfile ? (
                    <input 
                      type="text" 
                      value={profileForm.domiciliation || ''}
                      onChange={(e) => setProfileForm({...profileForm, domiciliation: e.target.value})}
                      className="neuro-input w-full px-4 py-3"
                    />
                  ) : (
                    <p className="text-lg">{user.domiciliation}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut du compte</label>
                  <p className={`text-lg font-semibold ${
                    user.accountStatus === 'Actif' ? 'text-green-600' : 'text-yellow-600'
                  }`}>{user.accountStatus}</p>
                </div>
                <div className="space-x-4">
                  {isEditingProfile ? (
                    <>
                      <button 
                        onClick={handleProfileUpdate}
                        className="bg-gradient-blue text-white px-6 py-3 rounded-2xl shadow-neuro hover:shadow-neuro-pressed transition-all"
                      >
                        Sauvegarder
                      </button>
                      <button 
                        onClick={() => setIsEditingProfile(false)}
                        className="neuro-button px-6 py-3 text-gray-700"
                      >
                        Annuler
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setIsEditingProfile(true)}
                      className="bg-gradient-blue text-white px-6 py-3 rounded-2xl shadow-neuro hover:shadow-neuro-pressed transition-all"
                    >
                      Modifier le profil
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'rib':
        return (
          <div className="neuro-card p-6">
            <h2 className="text-2xl font-bold gradient-text mb-6">Relevé d'Identité Bancaire</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
                  <p className="text-lg font-mono bg-gray-100 p-3 rounded-xl">{user.iban}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de compte</label>
                  <p className="text-lg font-mono">{user.accountNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code banque</label>
                  <p className="text-lg font-mono">{user.bankCode}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code agence</label>
                  <p className="text-lg font-mono">{user.agencyCode}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clé RIB</label>
                  <p className="text-lg font-mono">{user.ribKey}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code BIC</label>
                  <p className="text-lg font-mono">{user.bicCode}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Domiciliation</label>
                  <p className="text-lg">{user.domiciliation}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <button 
                onClick={downloadRIB}
                className="bg-gradient-blue text-white px-6 py-3 rounded-2xl shadow-neuro hover:shadow-neuro-pressed transition-all"
              >
                Télécharger le RIB
              </button>
            </div>
          </div>
        );

      case 'manager':
        return (
          <div className="neuro-card p-6">
            <h2 className="text-2xl font-bold gradient-text mb-6">Mon Gestionnaire</h2>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-blue rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{user.managerName}</h3>
                <p className="text-gray-600">Conseiller bancaire</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-lg">{user.managerName?.toLowerCase().replace(' ', '.')}@neurobank.com</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <p className="text-lg">+33 1 23 45 67 89</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilité</label>
                <p className="text-lg text-green-600">En ligne</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <button className="bg-gradient-blue text-white px-6 py-3 rounded-2xl shadow-neuro hover:shadow-neuro-pressed transition-all mr-4">
                Contacter par email
              </button>
              <button className="neuro-button px-6 py-3 text-gray-700 hover:text-neuro-blue transition-all">
                Prendre rendez-vous
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="neuro-card p-8 text-center">
            <h2 className="text-2xl font-bold gradient-text mb-4">Fonctionnalité en cours de développement</h2>
            <p className="text-gray-600">Cette section sera bientôt disponible.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neuro-bg">
      {/* Top Banner with Date and City */}
      <div className="bg-white/90 border-b border-gray-200 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-6 text-gray-700">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span className="hidden md:inline text-sm font-medium">
              {formatDate(currentDate)}
            </span>
            <span className="md:hidden text-xs font-medium">
              {currentDate.toLocaleDateString('fr-FR')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span className="text-sm font-medium">
              {user.city || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Header Compact et Responsive */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">

          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg shadow-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold">NeuroBank</h1>
            </div>
          </div>

          {/* Center Section - Time (visible on larger screens) */}
          <div className="hidden md:flex items-center">
            <span className="text-sm font-medium">{formatTime(currentDate)}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center">
            {/* Time (visible on mobile) */}
            <span className="md:hidden text-sm font-medium mr-3">{formatTime(currentDate)}</span>
            
            {/* Notifications */}
            <button 
              className="relative p-2 hover:bg-white/10 rounded-lg transition-colors mr-2"
              onClick={() => {
                if (notifications.length > 0) {
                  alert(`${notifications.length} nouvelle(s) notification(s):\n${notifications.map(n => n.message).join('\n')}`);
                }
              }}
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Profile - Hidden on smallest screens */}
            <button 
              className="hidden sm:block p-2 hover:bg-white/10 rounded-lg transition-colors mr-2"
              onClick={() => setActiveMenu('profile')}
            >
              <User className="w-5 h-5" />
            </button>

            {/* Logout - Hidden on smallest screens */}
            <button 
              onClick={handleLogout}
              className="hidden sm:block p-2 hover:bg-white/10 rounded-lg transition-colors text-red-300 hover:text-red-200 mr-2"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* Menu mobile */}
            <button 
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 flex gap-6 pt-6">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'block' : 'hidden'
        } lg:block w-64 space-y-2 fixed lg:relative top-0 left-0 h-full lg:h-auto bg-white lg:bg-transparent z-50 lg:z-auto p-4 lg:p-0`}>
          <div className="neuro-card p-4">
            {/* Mobile Only: User Info */}
            <div className="lg:hidden mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                {user.profilePhoto ? (
                  <img 
                    src={user.profilePhoto} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-blue rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{user.fullName}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveMenu(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${
                      activeMenu === item.id
                        ? 'bg-gradient-blue text-white shadow-neuro-pressed'
                        : 'hover:shadow-neuro-inset text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}

              {/* Mobile Only: Logout Button */}
              <button
                className="lg:hidden w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all text-red-600 hover:bg-red-50"
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogout();
                }}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="fixed top-4 right-4 z-50 lg:hidden p-2 rounded-full bg-white/90 text-gray-600 hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg">
        <div className="flex justify-around">
          {[
            { id: 'dashboard', icon: Home, label: 'Home' },
            { id: 'transfer', icon: ArrowUpRight, label: 'Virement' },
            { id: 'profile', icon: User, label: 'Profil' },
            { id: 'history', icon: History, label: 'Historique' },
            { id: 'logout', icon: LogOut, label: 'Déconnexion', onClick: handleLogout }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => item.onClick ? item.onClick() : setActiveMenu(item.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${
                  activeMenu === item.id ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
};

export default Dashboard;
