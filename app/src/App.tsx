import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';
import { Search } from 'lucide-react';

const tabs = ['New & Unvalidated', 'Validated', 'Requires Further Review', 'Not Applicable'];

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous sign-in failed:", error);
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" role="status" aria-live="polite">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Horizon Scanner</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Global search..."
              className="pl-10 pr-4 py-2 border rounded-md w-64"
              aria-label="Search"
            />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-6">
          {/* Content for each tab will go here */}
          <p>Content for {activeTab}</p>
        </div>
      </main>
    </div>
  );
}

export default App;
