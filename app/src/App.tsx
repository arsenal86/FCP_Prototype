import { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Search, FileDown } from 'lucide-react';
import type { Update } from './types';
import ItemCard from './components/ItemCard';
import AssessmentPanel from './components/AssessmentPanel';

declare global {
  interface Window {
    jsPDF: any;
    html2canvas: any;
  }
}


const tabs = ['New & Unvalidated', 'Validated', 'Requires Further Review', 'Not Applicable'];

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [filteredUpdates, setFilteredUpdates] = useState<Update[]>([]);
  const [eventTypeFilter, setEventTypeFilter] = useState('');
  const [impactedAreaFilter, setImpactedAreaFilter] = useState('');
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null);
  const [selectedReportItems, setSelectedReportItems] = useState<string[]>([]);

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

  const handleSelectReportItem = (id: string) => {
    setSelectedReportItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const createReport = async () => {
    const doc = new window.jsPDF();
    const reportItems = updates.filter(u => selectedReportItems.includes(u.id));
    
    for (let i = 0; i < reportItems.length; i++) {
      const item = reportItems[i];
      const element = document.createElement("div");
      element.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="font-size: 1.5rem; font-weight: bold;">${item.title}</h1>
          <p><strong>Source:</strong> ${item.source}</p>
          <p><strong>Published:</strong> ${new Date(item.publicationDate).toLocaleDateString()}</p>
          <hr style="margin: 10px 0;" />
          <h2>Detailed Summary</h2>
          <p>${item.detailedSummary || 'N/A'}</p>
          <h2>Impact Assessment</h2>
          <p>${item.impactAssessment || 'N/A'}</p>
          <p><strong>Timescales:</strong> ${item.timescales || 'N/A'}</p>
          <p><strong>Impacted Areas:</strong> ${item.impactedAreas.join(', ') || 'N/A'}</p>
        </div>
      `;
      document.body.appendChild(element);
      
      const canvas = await window.html2canvas(element);
      document.body.removeChild(element);
      
      const imgData = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      if (i > 0) doc.addPage();
      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }
    
    doc.save('consolidated-report.pdf');
    setSelectedReportItems([]);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><div>Loading...</div></div>;
  }

  const eventTypes = [...new Set(updates.map(update => update.type))];
  const impactedAreas = [...new Set(updates.flatMap(update => update.impactedAreas))];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`flex-1 transition-all duration-300 ${selectedUpdate ? 'w-2/3' : 'w-full'}`}>
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
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-4">
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
              {activeTab === 'Validated' && selectedReportItems.length > 0 && (
                <button onClick={createReport} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                  <FileDown size={16} className="mr-2" />
                  Create Report ({selectedReportItems.length})
                </button>
              )}
            </div>
            <div>
              {filteredUpdates.map(update => (
                <ItemCard
                  key={update.id}
                  update={update}
                  onClick={() => setSelectedUpdate(update)}
                  isSelected={selectedReportItems.includes(update.id)}
                  onSelect={handleSelectReportItem}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
      {selectedUpdate && (
        <div className="w-1/3">
          <AssessmentPanel update={selectedUpdate} onClose={() => setSelectedUpdate(null)} />
        </div>
      )}
    </div>
  );
}

export default App;
