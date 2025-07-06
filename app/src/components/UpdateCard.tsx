import React from 'react';
import { Update } from './types';

interface UpdateCardProps {
  update: Update;
}

const UpdateCard: React.FC<UpdateCardProps> = ({ update }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-lg font-bold">{update.title}</h3>
      <p className="text-sm text-gray-500">{update.source} - {update.publicationDate}</p>
      <p className="mt-2">{update.summary}</p>
    </div>
  );
};

export default UpdateCard;
