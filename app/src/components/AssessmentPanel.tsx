import React, { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Update } from '../types';
import { Save, Share2, X, Sparkles, MessageSquare } from 'lucide-react';
import { generateAssessment } from '../geminiService';
import ChatModal from './ChatModal';

interface AssessmentPanelProps {
  update: Update;
  onClose: () => void;
}

const AssessmentPanel: React.FC<AssessmentPanelProps> = ({ update, onClose }) => {
  const [formData, setFormData] = useState<Partial<Update>>(update);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    setFormData(update);
  }, [update]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImpactedAreasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, impactedAreas: value.split(',').map(s => s.trim()) }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateRef = doc(db, 'updates', update.id);
      await setDoc(updateRef, formData, { merge: true });
      alert('Assessment saved successfully!');
    } catch (error) {
      console.error("Error saving assessment: ", error);
      alert('Failed to save assessment.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    const summary = `
      **Regulatory Update Summary**

      **Title:** ${formData.title}
      **Source:** ${formData.source}
      **Publication Date:** ${formData.publicationDate}
      ---
      **Detailed Summary:**
      ${formData.detailedSummary}
      ---
      **Impact Assessment:**
      ${formData.impactAssessment}
      ---
      **Timescales:** ${formData.timescales || 'N/A'}
      **Impacted Business Areas:** ${formData.impactedAreas?.join(', ') || 'N/A'}
    `;
    navigator.clipboard.writeText(summary.trim().replace(/  +/g, ''));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleGenerateAssessment = async () => {
    setIsGenerating(true);
    try {
      const contentToAssess = update.summary || update.title;
      const result = await generateAssessment(contentToAssess);
      setFormData(prev => ({
        ...prev,
        detailedSummary: result.detailedSummary,
        impactAssessment: result.impactAssessment,
      }));
    } catch (error) {
      alert('Failed to generate AI assessment.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="fixed inset-y-0 right-0 w-1/3 bg-white shadow-xl z-20 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Assessment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Event Type</label>
          <input type="text" name="type" id="type" value={formData.type || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="detailedSummary" className="block text-sm font-medium text-gray-700">Detailed Summary</label>
          <textarea name="detailedSummary" id="detailedSummary" value={formData.detailedSummary || ''} onChange={handleChange} rows={5} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        </div>
        <div>
          <label htmlFor="impactAssessment" className="block text-sm font-medium text-gray-700">Impact Assessment</label>
          <textarea name="impactAssessment" id="impactAssessment" value={formData.impactAssessment || ''} onChange={handleChange} rows={5} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        </div>
        <div>
          <label htmlFor="timescales" className="block text-sm font-medium text-gray-700">Timescales</label>
          <input type="text" name="timescales" id="timescales" value={formData.timescales || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="impactedAreas" className="block text-sm font-medium text-gray-700">Impacted Business Areas (comma-separated)</label>
          <input type="text" name="impactedAreas" id="impactedAreas" value={formData.impactedAreas?.join(', ') || ''} onChange={handleImpactedAreasChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Internal Notes</label>
          <textarea name="notes" id="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        </div>
      </div>
        <div className="mt-6 flex justify-between items-center">
          <div>
            <button onClick={handleGenerateAssessment} disabled={isGenerating} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
              <Sparkles size={16} className="mr-2" />
              {isGenerating ? 'Generating...' : 'Generate AI Assessment'}
            </button>
            <button onClick={() => setIsChatOpen(true)} className="ml-2 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <MessageSquare size={16} className="mr-2" />
              Ask AI
            </button>
          </div>
          <div className="flex space-x-3">
            <button onClick={handleShare} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Share2 size={16} className="mr-2" />
              {isCopied ? 'Copied!' : 'Share'}
            </button>
            <button onClick={handleSave} disabled={isSaving} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              <Save size={16} className="mr-2" />
              {isSaving ? 'Saving...' : 'Save Assessment'}
            </button>
          </div>
        </div>
      </div>
      {isChatOpen && <ChatModal update={update} onClose={() => setIsChatOpen(false)} />}
    </>
  );
};

export default AssessmentPanel;
