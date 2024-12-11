import React, { useState, useEffect } from 'react';
import { database } from './firebase';
import { ref, onValue } from 'firebase/database';

const Wishlist = ({ receiver }) => {
  const [receiverWishlist, setReceiverWishlist] = useState([]);
  const [showReceiverWishlist, setShowReceiverWishlist] = useState(false);

  useEffect(() => {
    if (receiver) {
      const receiverWishlistRef = ref(database, `users/${receiver}/wishlist`);
      const unsubscribe = onValue(receiverWishlistRef, (snapshot) => {
        const data = snapshot.val();
        setReceiverWishlist(data || []);
      });

      return () => unsubscribe();
    }
  }, [receiver]);

  const handleToggleReceiverWishlist = () => {
    setShowReceiverWishlist((prev) => !prev);
  };

  return (
    <div className="WishlistForUser">
      <div className="">
        <a href='#' onClick={handleToggleReceiverWishlist}>
          {showReceiverWishlist ? 'Piilota vastaanottajan toivelista' : 'Näytä vastaanottajan toivelista'}
        </a>
        {showReceiverWishlist && (
          <div className="Wishlist mt-4">
            <ul className="wishlist-container">
              {receiverWishlist.length > 0 ? (
                receiverWishlist.map((wish, index) => (
                    <li key={index} style={{borderBottom: '1px solid #eee', padding: '10px 0'}}>
                        {wish}
                    </li>
                ))
              ) : (
                <li>Vastaanottajalla ei ole toiveita.</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;