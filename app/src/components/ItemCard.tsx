import React from 'react';
import type { Update } from '../types';
import { Calendar, FileText, Clock } from 'lucide-react';

interface ItemCardProps {
  update: Update;
  onClick: () => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ update, onClick, isSelected, onSelect }) => {
  const formattedPublicationDate = new Date(update.publicationDate).toLocaleDateString();
  const formattedCreatedAt = update.createdAt?.toDate ? update.createdAt.toDate().toLocaleDateString() : 'N/A';

  const handleSelect: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.stopPropagation();
    onSelect(update.id);
  };

  return (
    <div className={`bg-white shadow-md rounded-lg p-4 mb-4 border ${isSelected ? 'border-indigo-500' : 'border-gray-200'} cursor-pointer`} onClick={onClick}>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-gray-800">{update.title}</h3>
        {update.status === 'Validated' && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
            onClick={(e) => e.stopPropagation()}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
        )}
      </div>
      <div className="mt-2 space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <FileText size={14} className="mr-2 text-gray-500" />
          <span>Source: <a href={update.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{update.source}</a></span>
        </div>
        <div className="flex items-center">
          <Calendar size={14} className="mr-2 text-gray-500" />
          <span>Published: {formattedPublicationDate}</span>
        </div>
        <div className="flex items-center">
          <Clock size={14} className="mr-2 text-gray-500" />
          <span>Added to Scanner: {formattedCreatedAt}</span>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
