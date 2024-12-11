import React from 'react';
import './CelebrationNote.css';
import Wishlist from './Wishlist';

const CelebrationNote = ({selectedName, username}) => {
  return (
    <div className="celebration-note">
      <a1>🎁 Onnittelut! Ostat {selectedName}lle lahjan 🎁</a1>
      <Wishlist username={username.toLowerCase()} receiver={selectedName} />
    </div>
  );
};

export default CelebrationNote;