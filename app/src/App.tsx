import { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Search } from 'lucide-react';
import { Update } from './types';
import UpdateCard from './components/UpdateCard';

const tabs = ['New & Unvalidated', 'Validated', 'Requires Further Review', 'Not Applicable'];

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [filteredUpdates, setFilteredUpdates] = useState<Update[]>([]);
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [impactedAreaFilter, setImpactedAreaFilter] = useState('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous sign-in failed:", error);
          setLoading(false);
        });
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, `updates`));
      const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
        const updatesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Update));
        setUpdates(updatesData);
      });
      return () => unsubscribeFirestore();
    }
  }, [user]);

  useEffect(() => {
    let filtered = updates.filter(update => update.status === activeTab);

    if (eventTypeFilter) {
      filtered = filtered.filter(update => update.type === eventTypeFilter);
    }

    if (impactedAreaFilter) {
      filtered = filtered.filter(update => update.impactedAreas.includes(impactedAreaFilter));
    }

    setFilteredUpdates(filtered);
  }, [updates, activeTab, eventTypeFilter, impactedAreaFilter]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><div>Loading...</div></div>;
  }

  const eventTypes = [...new Set(updates.map(update => update.type))];
  const impactedAreas = [...new Set(updates.flatMap(update => update.impactedAreas))];

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
          <div className="flex space-x-4 mb-4">
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="">All Event Types</option>
              {eventTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <select
              value={impactedAreaFilter}
              onChange={(e) => setImpactedAreaFilter(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="">All Impacted Areas</option>
              {impactedAreas.map(area => <option key={area} value={area}>{area}</option>)}
            </select>
          </div>
          <div>
            {filteredUpdates.map(update => (
              <UpdateCard key={update.id} update={update} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
