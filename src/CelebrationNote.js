import React from 'react';
import './CelebrationNote.css';

const CelebrationNote = ({selectedName}) => {
  return (
    <div className="celebration-note">
      🎁 Onnittelut!
      Ostat {selectedName}lle lahjan 🎁
    </div>
  );
};

export default CelebrationNote;